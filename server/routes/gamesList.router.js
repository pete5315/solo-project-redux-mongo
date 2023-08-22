const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/old modules/authentication-middleware");
const User = require ("../models/user")
const newList = require("../modules/newList")
// const pool = require("../modules/pool");

// const router = express.Router();
const app = express();
const router = express.Router();
console.log("in users router")

// Define your routes and endpoints

//get all lists for a particular user
router.get("/", async (req, res) => {
  // Get all lists
  const lists = await User.find();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  // // Get all users
  // const users = await User.find();
  // res.json(users);
});

router.post("/", async (req, res) => {
  console.log(req.user);
  // Add a new list
  res = newList(req.params.id, res);
  User.updateOne(
    // { _id: req.user.id, 'orders.orderId': orderId }, //need req.user.id to show the _id value from mongo
    { _id: '64e3ebbab324bb30511206c6' },
    { $push: { 'lists': [{__id: 1, games: [], matchups: [], results: []}] } }
  )
    .then(result => {
      console.log('Update result:', result);
    })
    .catch(error => {
      console.error('Error updating nested array:', error);
    });
  // res.json(user);
});

router.put("/:id", async (req, res) => {
  // // Update a user by ID
  // const user = await User.findById(req.params.id);
  // user.name = req.body.name;
  // user.age = req.body.age;
  // await user.save();
  // res.json(user);
});

router.delete("/:id", async (req, res) => {
  // // Delete a user by ID
  // await User.findByIdAndDelete(req.params.id);
  // res.sendStatus(204);
});

module.exports = router