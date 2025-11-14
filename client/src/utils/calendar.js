export function googleCalendarLink({ title, start, end, description = '', location = '' }) {
  const fmt = (d) => new Date(d).toISOString().replace(/-|:|\.\d{3}/g, '')
  const s = fmt(start)
  const e = fmt(end)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title || '',
    dates: `${s}/${e}`,
    details: description || '',
    location: location || '',
  })
  return `https://www.google.com/calendar/render?${params.toString()}`
}
