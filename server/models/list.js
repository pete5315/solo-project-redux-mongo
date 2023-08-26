const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  _id: Number,
  completed: Boolean,
  lastModifiedDate: Date,
  games: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game", // Assuming your game model is named "Game"
    },
  ],
});

const List = mongoose.model("List", listSchema);

module.exports = List;
