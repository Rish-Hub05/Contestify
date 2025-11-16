const mongoose = require('mongoose')

const SubSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  contestId: { type: String, required: true, index: true },
  contestName: { type: String, required: true },
  contestUrl: { type: String },
  contestStartTime: { type: Date },
  notifyAt: { type: Date, required: true, index: true },
  sent: { type: Boolean, default: false, index: true },
}, { timestamps: true })

module.exports = mongoose.model('Subscription', SubSchema)
