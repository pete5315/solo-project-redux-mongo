const mongoose = require("mongoose");

const matchupSchema = new mongoose.Schema({
  __matchupsId: Number,
  matchupNumber: Number,
  games: Array,
});

const User = mongoose.model("Matchup", matchupSchema);

module.exports = Matchup;
