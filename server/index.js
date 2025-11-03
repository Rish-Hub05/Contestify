require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/contests', require('./routes/contests'))
app.use('/api/bookmarks', require('./routes/bookmarks'))
app.use('/api/solutions', require('./routes/solutions'))

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {})
  })
  .catch((err) => {
    process.exit(1)
  })
