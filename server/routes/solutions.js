const router = require('express').Router()
const Solution = require('../models/Solution')

// POST /api/solutions -> Add a YouTube link
router.post('/', async (req, res) => {
  try {
    const { contestName, youtubeLink } = req.body || {}
    const doc = await Solution.create({ contestName, youtubeLink })
    return res.status(201).json(doc)
  } catch (err) {
    return res.status(400).json({ error: 'Failed to create solution' })
  }
})

// GET /api/solutions -> Get all links
router.get('/', async (_req, res) => {
  try {
    const list = await Solution.find({}).sort({ _id: -1 })
    return res.json(list)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch solutions' })
  }
})

// DELETE /api/solutions/:id -> Delete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Solution.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ error: 'Solution not found' })
    return res.json({ success: true })
  } catch (err) {
    return res.status(400).json({ error: 'Failed to delete solution' })
  }
})

module.exports = router
