export default function iconFor(site = '') {
  const s = String(site).toLowerCase()
  if (s.includes('codeforces')) return '/icons/codeforces.svg'
  if (s.includes('codechef')) return '/icons/codechef.svg'
  if (s.includes('leetcode')) return '/icons/leetcode.svg'
  return '/icons/default.svg'
}
