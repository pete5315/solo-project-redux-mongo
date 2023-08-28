const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const User = require("../models/user");
const List = require("../models/list");
const Game = require("../models/game");
const lastListId = require("../modules/lastListId");
const lastGameId = require("../modules/lastGameId");
const mongoose = require("mongoose");
const getListandGames = require("../modules/getListandGames");
// const pool = require("../modules/pool");

// const router = express.Router();
const app = express();
const router = express.Router();
console.log("in users router");

// Define your routes and endpoints

//get all lists for a particular user
router.get("/", async (req, res) => {
  let jsonResult, objectIdArray;
  // Get all lists
  await User.find({
    _id: "64e8f95c35b3cb20363ad4ed",
  }) //will need to include the specific userid when authentication/login is working, hardcoded for now
    .then((documents) => {
      jsonResult = JSON.parse(JSON.stringify(documents, null, 2)); //this converts the cursor to object format
      userLists = jsonResult[0].lists;
      objectIdArray = documents[0].lists;
      // res.send(jsonResult[0].lists); //this should return the id of the newest list just added
    })
    .catch((error) => {
      console.error("Error fetching and converting documents:", error);
    });
  let aggregateResult = await getListandGames(objectIdArray);
  res.send(aggregateResult);
});

router.get("/:listid", async (req, res) => {
  let jsonResult, objectIdArray;
  let listId = req.params.listid;
  // Get all lists
  await List.find({
    _id: listId,
  }) //will need to include the specific userid when authentication/login is working, hardcoded for now
    .then((documents) => {
      console.log(documents);
      jsonResult = JSON.parse(JSON.stringify(documents, null, 2)); //this converts the cursor to object format
      userLists = jsonResult[0].lists;
      objectIdArray = documents[0]._id;
      // res.send(jsonResult[0].lists); //this should return the id of the newest list just added
    })
    .catch((error) => {
      console.error("Error fetching and converting documents:", error);
    });
  console.log(objectIdArray);
  let aggregateResult = await getListandGames([objectIdArray]);
  console.log(aggregateResult);
  res.send(aggregateResult);
});

router.get("/games/:listid", async (req, res) => {
  //get the games from a particular list
  const listId = req.params.listid;
  console.log("reqbody", req.body);
  try {
    const list = await List.findOne(
      {
        _id: "64e8f95c35b3cb20363ad4ed", // User ID hardcoded for now
        "lists._id": listId,
      },
      { "lists.$": 1 }
    );

    if (list && list.length > 0) {
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

router.post("/", async (req, res) => {
  //make a new list
  console.log("requser42", req.user);
  // let newId = await lastListId(req.params.id);
  // console.log(newId, "newid")
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Create a new list
    const newList = await List.create(
      [
        {
          // _id: newId + 1,
          completed: false,
          lastModifiedDate: new Date(),
          games: [],
        },
      ],
      { session }
    );
    console.log(newList[0]._id);
    // Update user's lists array
    await User.updateOne(
      { _id: "64e8f95c35b3cb20363ad4ed" },
      { $push: { lists: newList[0]._id } },
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  // User.updateOne(
  //   //this adds a new list
  //   // { _id: req.user.id, 'orders.orderId': orderId }, //need req.user.id to show the _id value from mongo
  //   { _id: "64e8f95c35b3cb20363ad4ed" }, //user id hardcoded currently
  //   {
  //     $push: {
  //       lists: [
  //         {
  //           _id: newId + 1,
  //           games: [],
  //           matchups: [],
  //           results: [],
  //           lastModifiedDate: new Date(),
  //           completed: false,
  //         },
  //       ],
  //     },
  //   } //this is the list object format, __id hardcoded currently
  // )
  //   .then((result) => {
  //     console.log("Update result:", result);
  //   })
  //   .catch((error) => {
  //     console.error("Error updating nested array:", error);
  //   });
  // res.json(user);
  res.sendStatus(200);
});

router.post("/addgame/:listid", async (req, res) => {
  //add a new game to a particular list
  console.log("reqbody72", req.body);
  // Add a new list
  // console.log('newid', newId);
  console.log(req.params.listid);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Create a new game
    const newGame = await Game.create(
      [
        {
          name: req.body.newGame,
          url: req.body.url,
          thumbnail: req.body.thumbnail,
        },
      ],
      { session }
    );
    console.log(newGame[0]._id);
    // Update list's games array
    await List.updateOne(
      { _id: req.params.listid },
      { $push: { games: newGame[0]._id } },
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  // let newId = await lastGameId(req.params.listid);
  // console.log("newid", newId);
  // User.updateOne(
  //   { _id: "64e8f95c35b3cb20363ad4ed", "lists._id": req.params.listid }, //user id hardcoded currently
  //   {
  //     $addToSet: {
  //       "lists.$.games": [
  //         {
  //           __gameId: newId + 1,
  //           name: req.body.newGame,
  //           url: req.body.url,
  //           betterThan: [],
  //           worseThan: [],
  //         },
  //       ],
  //     },
  //   } //this is the list object format, __id hardcoded currently
  // )
  //   .then((result) => {
  //     console.log("Update result:", result);
  //   })
  //   .catch((error) => {
  //     console.error("Error updating nested array:", error);
  //   });
  // res.sendStatus(200);
});

router.post("/addmanygames/:listid", async (req, res) => {
  let newGames = req.body.collection;
  console.log("197", newGames);
  let addedGamesArray = [];
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Create a new game
    for (let newGame of newGames) {
      addedGamesArray.push(
        await Game.create(
          [
            {
              name: newGame.newGame,
              url: newGame.url,
              thumbnail: newGame.thumbnail,
            },
          ],
          { session }
        )
      );
    }
    console.log("217", addedGamesArray);
    // console.log(newGame[0]._id);
    // Update list's games array
    for (let addedGame of addedGamesArray) {
      console.log("221", addedGame[0]._id, req.params.listid);
      await List.updateOne(
        { _id: req.params.listid },
        { $push: { games: addedGame[0]._id } },
        { session }
      );
    }
    console.log("228");
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
  console.log("236", req.params.listid);
  res.send(await getListandGames([req.params.listid]));
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
  console.log("delete req params", req.params.listId);
  const { userId, listId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await List.findOneAndDelete({ _id: listId }, { session });
    await User.updateMany({}, { $pull: { lists: listId } }, { session });
    await session.commitTransaction();
  } catch (error) {
    console.error("Error deleting game:", error);
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
    res.sendStatus(200);
  }
});

router.delete("/deletegame/:listId/:gameId", async (req, res) => {
  const listId = req.params.listId;
  const gameId = req.params.gameId;
  console.log("in delete route", listId, gameId);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await List.updateOne(
      { _id: listId },
      { $pull: { games: { $in: [gameId] } } },
      { session },
      (err, result) => {
        if (err) {
          console.error("Error:", err);
        } else {
          console.log("Games removed:", result);
        }
      }
    );
    await session.commitTransaction();
  } catch (error) {
    console.error("Error deleting game:", error);
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
  res.sendStatus(200);
});

module.exports = router;
