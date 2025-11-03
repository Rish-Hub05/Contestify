import { useEffect, useMemo, useState } from 'react'

export default function Countdown({ startTime }) {
  const target = useMemo(() => new Date(startTime).getTime(), [startTime])
  const [remaining, setRemaining] = useState(() => target - Date.now())

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(target - Date.now())
    }, 1000)
    return () => clearInterval(id)
  }, [target])

  if (!Number.isFinite(target)) return null
  if (remaining <= 0) return <span>Started</span>
  const totalSec = Math.floor(remaining / 1000)
  const days = Math.floor(totalSec / 86400)
  const hrs = Math.floor((totalSec % 86400) / 3600)
  const min = Math.floor((totalSec % 3600) / 60)
  const sec = totalSec % 60
  const pad = (n) => String(n).padStart(2, '0')

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {days > 0 ? `${days}d ` : ''}{pad(hrs)}:{pad(min)}:{pad(sec)}
    </span>
  )
}
