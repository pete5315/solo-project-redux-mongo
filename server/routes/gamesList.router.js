const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const User = require("../models/user");
const lastListId = require("../modules/lastListId");
const lastGameId = require("../modules/lastGameId");
// const pool = require("../modules/pool");

// const router = express.Router();
const app = express();
const router = express.Router();
console.log("in users router");

// Define your routes and endpoints

//get all lists for a particular user
router.get("/", async (req, res) => {
  // Get all lists
  await User.find({
    _id: "64e6493ce50dc851f964407d",
  }) //will need to include the specific userid when authentication/login is working, hardcoded for now
    .then((documents) => {
      const jsonResult = JSON.parse(JSON.stringify(documents, null, 2)); //this converts the cursor to object format
      res.send(jsonResult[0].lists); //this should return the id of the newest list just added
    })
    .catch((error) => {
      console.error("Error fetching and converting documents:", error);
    });
});

router.get("/games/:listid", async (req, res) => { //get the games from a particular list
  const listId = req.params.listid;
  console.log(listId);
  try {
    const user = await User.findOne(
      {
        _id: "64e6493ce50dc851f964407d", // User ID hardcoded for now
        "lists.__listId": listId,
      },
      { "lists.$": 1 }
    );

    if (user && user.lists.length > 0) {
      const list = user.lists[0];
      res.status(200).json(list);
    } else {
      res.status(404).send("List not found");
    }
  } catch (error) {
    console.error("Error retrieving list:", error);
    res.status(500).send("Error retrieving list");
  }

});

router.post("/", async (req, res) => { //make a new list
  console.log("requser42", req.user);
  // Add a new list
  let newId = await lastListId(req.params.id, res);
  // console.log('newid', newId);
  console.log(await lastListId(req.params.id, res));
  User.updateOne(
    //this adds a new list
    // { _id: req.user.id, 'orders.orderId': orderId }, //need req.user.id to show the _id value from mongo
    { _id: "64e6493ce50dc851f964407d" }, //user id hardcoded currently
    {
      $push: {
        lists: [
          {
            __listId: newId + 1,
            games: [],
            matchups: [],
            results: [],
            lastModifiedDate: new Date(),
            completed: false,
          },
        ],
      },
    } //this is the list object format, __id hardcoded currently
  )
    .then((result) => {
      console.log("Update result:", result);
    })
    .catch((error) => {
      console.error("Error updating nested array:", error);
    });
  // res.json(user);
});

router.post("/addgame/:listid", async (req, res) => { //add a new game to a particular list
  console.log("reqbody72", req.body);
  // Add a new list
  // console.log('newid', newId);
  console.log(req.params.listid);
  let newId = await lastGameId(req.params.listid);
  console.log("newid", newId);
  User.updateOne(
    { _id: "64e6493ce50dc851f964407d", "lists.__listId": req.params.listid }, //user id hardcoded currently
    {
      $addToSet: {
        "lists.$.games": [
          {
            __gameId: newId+1,
            name: req.body.newGame,
            url: req.body.url,
            betterThan: [],
            worseThan: [],
          },
        ],
      },
    } //this is the list object format, __id hardcoded currently
  )
    .then((result) => {
      console.log("Update result:", result);
    })
    .catch((error) => {
      console.error("Error updating nested array:", error);
    });
  res.sendStatus(200);
});

router.put("/:id", async (req, res) => {
  // // Update a user by ID
  // const user = await User.findById(req.params.id);
  // user.name = req.body.name;
  // user.age = req.body.age;
  // await user.save();
  // res.json(user);
});

router.delete("/:userId/:listId", async (req, res) => {
  // // Delete a user by ID
  console.log("delete req params", req.params.id);
  const { userId, listId } = req.params;

  try {
    const user = await User.findById("64e6493ce50dc851f964407d"); //userId hardcoded for now

    if (user) {
      // Use the $pull operator to remove the list by its listId
      user.lists = user.lists.filter(
        (list) => list.__listId !== parseInt(listId, 10)
      );
      await user.save();

      console.log(`List with listId ${listId} deleted for user ${userId}`);
      res
        .status(200)
        .json({ message: `List with listId ${listId} deleted successfully` });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting list:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/deletegame/:listId/:gameId", async (req, res) => {
  const listId = req.params.listId;
  const gameId = req.params.gameId;

  try {
    await User.updateOne(
      {
        _id: "64e6493ce50dc851f964407d", // User ID hardcoded for now
        "lists.__listId": listId,
      },
      {
        $pull: {
          "lists.$.games": {
            __gameId: gameId,
          },
        },
      }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).send("Error deleting game");
  }
});

module.exports = router;
