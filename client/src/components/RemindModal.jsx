import React, { useState } from 'react'

export default function RemindModal({ open, onClose, onSubmit, initialMinutes = 60 }) {
  const [email, setEmail] = useState('')
  const [minutes, setMinutes] = useState(initialMinutes)

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    const mins = Number(minutes || initialMinutes) || initialMinutes
    onSubmit({ email, minutes: mins })
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          padding: 16,
          borderRadius: 8,
          minWidth: 280,
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>Email reminder</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 12 }}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #ccc', marginTop: 2 }}
            />
          </label>
          <label style={{ fontSize: 12 }}>
            Minutes before start
            <input
              type="number"
              min="1"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #ccc', marginTop: 2 }}
            />
          </label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #2563eb', background: '#2563eb', color: '#fff', cursor: 'pointer' }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
