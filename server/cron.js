const cron = require('node-cron')
const Subscription = require('./models/Subscription')
const { sendNotification } = require('./utils/mailer')

function startCron() {
  // Every minute
  console.log('[cron] scheduler init')
  cron.schedule('* * * * *', async () => {
   // console.log('[cron] tick', new Date().toISOString())
    const now = new Date()
    try {
      const due = await Subscription.find({ notifyAt: { $lte: now }, sent: false }).limit(100)
      for (const s of due) {
        try {
          const info = await sendNotification(
            s.email,
            `Contest Reminder: ${s.contestName}`,
            `<p>Contest <strong>${s.contestName}</strong> starts soon.</p>`
          )
          const accepted = Array.isArray(info?.accepted) ? info.accepted : []
          const rejected = Array.isArray(info?.rejected) ? info.rejected : []
          if (accepted.includes(s.email)) {
            console.log('[cron] sent', s.email, s.contestName)
            s.sent = true
            await s.save()
          } else {
            console.warn('[cron] mail not accepted', { email: s.email, accepted, rejected })
          }
        } catch (e) {
          console.error('mail fail', e?.message || e)
        }
      }
    } catch (e) {
      console.error('cron query fail', e?.message || e)
    }
  })
}

module.exports = { startCron }
