 import React, { useEffect, useState } from 'react'
import api from '../services/api'
import ContestCard from '../components/ContestCard'

export default function Home() {
  const [view, setView] = useState('upcoming')
  const [contests, setContests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState('All') // 'All' | 'Codeforces' | 'CodeChef' | 'LeetCode'

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/contests', { params: { site: 'all' } })
        if (!cancelled) setContests(Array.isArray(data?.contests) ? data.contests : [])
      } catch (e) {
        if (!cancelled) setError('Failed to load contests')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  const now = Date.now()
  const filteredByView = contests.filter((c) => {
    const start = c?.start_time ? new Date(c.start_time).getTime() : null
    const end = c?.end_time ? new Date(c.end_time).getTime() : null
    if (view === 'upcoming') {
      return (start && start >= now)
    }
    return (end ? end < now : (start ? start < now : false))
  })

  const filtered = filteredByView.filter((c) => {
    const matchesName = (c?.name || '').toLowerCase().includes(query.toLowerCase())
    const matchesPlatform = platform === 'All' || (c?.site || '').toLowerCase() === platform.toLowerCase()
    return matchesName && matchesPlatform
  })

  async function handleBookmark(contest) {
    try {
      await api.post('/bookmarks', {
        name: contest.name,
        url: contest.url,
        site: contest.site,
        start_time: contest.start_time,
        end_time: contest.end_time,
      })
      alert('Bookmarked')
    } catch (e) {
      alert('Failed to bookmark')
    }
  }

  const btn = (label, active, onClick) => (
    <button
      onClick={onClick}
      style={{
        padding: '6px 10px',
        border: '1px solid #ccc',
        background: active ? '#eef' : '#fff',
        cursor: 'pointer',
        borderRadius: 6,
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </button>
  )

  return (
    <div>
      <h2>Contests</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {btn('Upcoming', view === 'upcoming', () => setView('upcoming'))}
        {btn('Past', view === 'past', () => setView('past'))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search contests..."
          style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: 6, minWidth: 220 }}
        />
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: 6 }}
        >
          <option>All</option>
          <option>Codeforces</option>
          <option>CodeChef</option>
          <option>LeetCode</option>
        </select>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div>
        {filtered.map((c, i) => (
          <div key={`${c.site}-${c.name}-${i}`} style={{ marginBottom: 8 }}>
            <ContestCard
              name={c.name}
              url={c.url}
              site={c.site}
              start_time={c.start_time}
              end_time={c.end_time}
              onBookmark={() => handleBookmark(c)}
            />
          </div>
        ))}
        {!loading && !error && filtered.length === 0 && (
          <div>No contests found.</div>
        )}
      </div>
    </div>
  )
}
