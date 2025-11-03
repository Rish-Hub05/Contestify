 const router = require('express').Router()
 const axios = require('axios')

 const CODECHEF_URL = 'https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all'
 const CODEFORCES_URL = 'https://codeforces.com/api/contest.list'
 const LEETCODE_URL = 'https://leetcode.com/graphql'

 async function fetchCodeforces() {
   try {
     const { data } = await axios.get(CODEFORCES_URL, { timeout: 15000 })
     const list = Array.isArray(data?.result) ? data.result : []
     return list.map((c) => {
       const startSec = Number(c?.startTimeSeconds || 0)
       const durSec = Number(c?.durationSeconds || 0)
       return {
         name: c?.name || '',
         url: c?.id ? `https://codeforces.com/contest/${c.id}` : 'https://codeforces.com/contests',
         site: 'codeforces',
         start_time: startSec ? new Date(startSec * 1000) : null,
         end_time: startSec ? new Date((startSec + durSec) * 1000) : null,
       }
     }).filter((x) => x.name)
   } catch (e) {
     return []
   }
 }

 function mapCodeChefItem(it) {
   const name = it?.contest_name || it?.name || it?.title || ''
   const code = it?.contest_code || it?.code || ''
   const url = code ? `https://www.codechef.com/${code}` : (it?.url || 'https://www.codechef.com/contests')
   const startRaw = it?.contest_start_date || it?.start_time || it?.startTime || it?.start_date || it?.startDate
   const endRaw = it?.contest_end_date || it?.end_time || it?.endTime || it?.end_date || it?.endDate
   const start = startRaw ? new Date(startRaw) : null
   const end = endRaw ? new Date(endRaw) : null
   return {
     name,
     url,
     site: 'codechef',
     start_time: start,
     end_time: end,
   }
 }

 async function fetchCodeChef() {
   try {
     const { data } = await axios.get(CODECHEF_URL, { timeout: 15000, headers: { 'accept': 'application/json' } })
     const collections = []
     if (Array.isArray(data)) collections.push(data)
     for (const key of ['future_contests', 'present_contests', 'past_contests', 'contests', 'result']) {
       if (Array.isArray(data?.[key])) collections.push(data[key])
     }
     const items = collections.flat()
     return items.map(mapCodeChefItem).filter((x) => x.name)
   } catch (e) {
     return []
   }
 }

 async function fetchLeetCode() {
   try {
     const query = {
       query: '{\n  allContests {\n    title\n    startTime\n    duration\n    site\n    url\n  }\n}',
       variables: {},
       operationName: null,
     }
     const { data } = await axios.post(LEETCODE_URL, query, {
       timeout: 15000,
       headers: { 'content-type': 'application/json' },
     })
     const items = data?.data?.allContests || []
     return items.map((c) => {
       const startSec = Number(c?.startTime || 0)
       const durSec = Number(c?.duration || 0)
       return {
         name: c?.title || '',
         url: c?.url || 'https://leetcode.com/contest/',
         site: 'leetcode',
         start_time: startSec ? new Date(startSec * 1000) : null,
         end_time: startSec ? new Date((startSec + durSec) * 1000) : null,
       }
     }).filter((x) => x.name)
   } catch (e) {
     return []
   }
 }

function byStartTimeAsc(a, b) {
  const ax = a.start_time ? new Date(a.start_time).getTime() : 0
  const bx = b.start_time ? new Date(b.start_time).getTime() : 0
  return ax - bx
}

router.get('/', async (req, res) => {
  const site = (req.query.site || '').toString().toLowerCase()
  try {
    if (site === 'codeforces') {
      const cf = await fetchCodeforces()
      return res.json({ contests: cf.sort(byStartTimeAsc) })
    }
    if (site === 'codechef') {
      const cc = await fetchCodeChef()
      return res.json({ contests: cc.sort(byStartTimeAsc) })
    }
    if (site === 'leetcode') {
      const lc = await fetchLeetCode()
      return res.json({ contests: lc.sort(byStartTimeAsc) })
    }

    // site === 'all' or unspecified
    const [cc, cf, lc] = await Promise.all([
      fetchCodeChef(),
      fetchCodeforces(),
      fetchLeetCode(),
    ])
    const all = [...cc, ...cf, ...lc].sort(byStartTimeAsc)
    return res.json({ contests: all })
  } catch (err) {
    return res.status(500).json({ contests: [], error: 'Failed to fetch contests' })
  }
})

module.exports = router
