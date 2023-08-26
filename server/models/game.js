const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  __gameId: Number,
  name: String,
  url: String,
  thumbnail: String,
  betterThan: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
  worseThan: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
})



const Game = mongoose.model("Game", gameSchema);

module.exports = Game