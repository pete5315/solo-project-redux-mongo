const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
