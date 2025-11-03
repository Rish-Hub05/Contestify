const mongoose = require("mongoose");
const BookmarkSchema = new mongoose.Schema({
  name: String,
  url: String,
  site: String,
  start_time: Date,
  end_time: Date,
});
module.exports = mongoose.model("Bookmark", BookmarkSchema);
