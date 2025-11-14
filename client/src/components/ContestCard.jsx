 import React from 'react'
import Countdown from './Countdown'
import iconFor from '../utils/platformIcon'
import { googleCalendarLink } from '../utils/calendar'

export default function ContestCard({ name, url, site, start_time, end_time, onBookmark }) {
  const start = start_time ? new Date(start_time) : null
  const end = end_time ? new Date(end_time) : null
  const isUpcoming = start ? start.getTime() > Date.now() : false
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
    </div>
  )
}
