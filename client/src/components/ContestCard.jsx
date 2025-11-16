 import React, { useState } from 'react'
import Countdown from './Countdown'
import iconFor from '../utils/platformIcon'
import { googleCalendarLink } from '../utils/calendar'
import api from '../services/api'
import RemindModal from './RemindModal'

export default function ContestCard({ name, url, site, start_time, end_time, onBookmark }) {
  const start = start_time ? new Date(start_time) : null
  const end = end_time ? new Date(end_time) : null
  const isUpcoming = start ? start.getTime() > Date.now() : false
  const [showRemind, setShowRemind] = useState(false)

  async function handleRemindSubmit({ email, minutes }) {
    try {
      const notifyBeforeMinutes = Number(minutes || 60) || 60
      const contestId = `${site}:${name}`
      await api.post('/subscribe', {
        email,
        contestId,
        contestName: name,
        notifyBeforeMinutes,
        contestStartTime: start_time,
        contestUrl: url,
      })
      setShowRemind(false)
      alert('Subscribed! You will receive an email reminder.')
    } catch (e) {
      alert('Failed to subscribe for reminder')
    }
  }
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src={iconFor(site)} alt={site} style={{ width: 20, height: 20 }} />
        <div style={{ fontWeight: 600 }}>{name}</div>
      </div>
      <div style={{ fontSize: 12, color: '#666' }}>{site}</div>
      <div style={{ fontSize: 12 }}>
        {start ? `Starts: ${start.toLocaleString()}` : ''}
        {end ? `  •  Ends: ${end.toLocaleString()}` : ''}
      </div>
      {isUpcoming && start && (
        <div style={{ marginTop: 6, fontSize: 14 }}>
          <Countdown startTime={start} />
        </div>
      )}
      {url && (
        <a href={url} target="_blank" rel="noreferrer">Open</a>
      )}
      <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {start && end && (
          <a
            href={googleCalendarLink({ title: name, start: start, end: end, description: url })}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none', border: '1px solid #ccc', padding: '6px 10px', borderRadius: 6 }}
          >
            📅 Add to Google Calendar
          </a>
        )}
        {isUpcoming && (
          <button
            onClick={() => setShowRemind(true)}
            style={{
              padding: '6px 10px',
              border: '1px solid #ccc',
              background: '#fff',
              cursor: 'pointer',
              borderRadius: 6,
            }}
          >
            Remind me
          </button>
        )}
        <button
          onClick={onBookmark}
          style={{
            padding: '6px 10px',
            border: '1px solid #ccc',
            background: '#fff',
            cursor: 'pointer',
            borderRadius: 6,
          }}
          >
          Bookmark
        </button>
      </div>
      <RemindModal
        open={showRemind}
        onClose={() => setShowRemind(false)}
        onSubmit={handleRemindSubmit}
        initialMinutes={60}
      />
    </div>
  )
}
