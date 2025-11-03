const mongoose = require("mongoose");
const SolutionSchema = new mongoose.Schema({
  contestName: String,
  youtubeLink: String,
});
module.exports = mongoose.model("Solution", SolutionSchema);
