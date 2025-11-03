const router = require('express').Router()
const Bookmark = require('../models/Bookmark')

// POST /api/bookmarks -> Add a bookmark
router.post('/', async (req, res) => {
  try {
    const { name, url, site, start_time, end_time } = req.body || {}
    const doc = await Bookmark.create({
      name,
      url,
      site,
      start_time,
      end_time,
    })
    return res.status(201).json(doc)
  } catch (err) {
    return res.status(400).json({ error: 'Failed to create bookmark' })
  }
})

// GET /api/bookmarks -> List all
router.get('/', async (_req, res) => {
  try {
    const list = await Bookmark.find({}).sort({ start_time: 1, _id: 1 })
    return res.json(list)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch bookmarks' })
  }
})

// DELETE /api/bookmarks/:id -> Remove a bookmark
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Bookmark.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ error: 'Bookmark not found' })
    return res.json({ success: true })
  } catch (err) {
    return res.status(400).json({ error: 'Failed to delete bookmark' })
  }
})

module.exports = router
