require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/contests', require('./routes/contests'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/solutions', require('./routes/solutions'));
app.use('/api/subscribe', require('./routes/subscribe'));

const PORT = process.env.PORT || 5000;

// ================================
// Start Server + DB + CRON
// ================================

mongoose
  .connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
  useUnifiedTopology: true,

  })
  .then(() => {
    console.log("✅ MongoDB connected");

    // Start cron only after DB is connected
    try {
      const { startCron } = require('./cron');
      console.log("⏳ Starting cron scheduler...");
      startCron();
    } catch (err) {
      console.error("❌ Failed to start cron:", err.message);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
