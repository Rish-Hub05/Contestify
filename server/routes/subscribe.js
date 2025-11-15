const router = require('express').Router()
const Subscription = require('../models/Subscription')

router.post('/', async (req, res) => {
  try {
    const { email, contestId, contestName, notifyBeforeMinutes = 60, contestStartTime } = req.body || {}
    if (!email || !contestId || !contestName || !contestStartTime) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' })
    }
    const startMs = new Date(contestStartTime).getTime()
    if (!Number.isFinite(startMs)) {
      return res.status(400).json({ ok: false, error: 'Invalid contestStartTime' })
    }
    const minutes = Number(notifyBeforeMinutes)
    const notifyAt = new Date(startMs - (Number.isFinite(minutes) ? minutes : 60) * 60 * 1000)

    // Upsert style: if existing pending subscription, update; else create
    const existing = await Subscription.findOne({ email, contestId })
    if (existing) {
      existing.notifyAt = notifyAt
      existing.sent = false
      existing.contestName = contestName
      await existing.save()
      return res.json({ ok: true, subscription: existing })
    }

    const sub = await Subscription.create({ email, contestId, contestName, notifyAt, sent: false })
    return res.json({ ok: true, subscription: sub })
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'Failed to create subscription' })
  }
})

module.exports = router
