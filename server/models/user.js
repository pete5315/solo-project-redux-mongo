const mongoose = require("mongoose");

const gamesSchema = new mongoose.Schema({
  __id: Number,
  name: String,
  url: String,
  betterThan: Array,
  worseThan: Array,
})

const matchupsSchema = new mongoose.Schema({
  __id: Number,
  matchupNumber: Number,
  games: Array,
})

const resultsSchema = new mongoose.Schema({
  __id: Number,
  best: Number,
  worst: Number,
  unranked1: Number,
  unranked2: Number,
})

const listSchema = new mongoose.Schema({
  __id: Number,
  games: [gamesSchema],
  matchups: [matchupsSchema],
  results: [resultsSchema],
})

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  lists: [listSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User