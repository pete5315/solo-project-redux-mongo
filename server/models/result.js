const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  __resultsId: Number,
  best: Number,
  worst: Number,
  unranked1: Number,
  unranked2: Number,
});

const User = mongoose.model("Result", resultSchema);

module.exports = Result;
