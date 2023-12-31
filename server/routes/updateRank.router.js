const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");
const User = require("../models/user");
const { number } = require("prop-types");

const router = express.Router();

const fetchRandomGame = require("../modules/fetchRandomGames");

router.post("/:listid", rejectUnauthenticated, async (req, res) => {
  const listId = req.params.listid;
  console.log(req.body);
  let currentBest = req.body.currentBest;
  let currentWorst = req.body.currentWorst;
  let currentMiddle1 = null;
  let currentMiddle2 = null;

  for (let randomGameInstance of req.body.randomGames) {
    console.log(randomGameInstance);

    if (
      randomGameInstance._id !== currentBest &&
      randomGameInstance._id !== currentWorst
    ) {
      if (currentMiddle1 === null) {
        console.log("middle 1", randomGameInstance._id);
        currentMiddle1 = randomGameInstance._id;
      } else {
        console.log("middle 2", randomGameInstance._id);
        currentMiddle2 = randomGameInstance._id;
      }
    }
  }

  console.log(
    "currentBest",
    currentBest,
    "currentMiddle1",
    currentMiddle1,
    "currentMiddle2",
    currentMiddle2,
    "currentWorst",
    currentWorst
  );

  //function to get games that the current best is better than
  //function to get games that the current worst is worse than
  //function to get games that the current best is worse than
  //function to get games that the current worst is better than
  //function to get games that the current middle1 is better than
  //function to get games that the current middle2 is better than
  //function to get games that the current middle1 is worse than
  //function to get games that the current middle2 is worse than
  let bestIsWorseThan = [1,2];
  let middle1IsBetterThan = [1,2];
  let middle1IsWorseThan = [1,2];
  let middle2IsBetterThan = [1,2];
  let middle2IsWorseThan = [1,2];
  let worstIsBetterThan = [1,2];

  let bestUpdatesBetters = [
    ...middle1IsBetterThan,
    ...middle2IsBetterThan,
    ...worstIsBetterThan,
    currentMiddle1,
    currentMiddle2,
    currentWorst,
  ];
  let middle1UpdateBetters = [...worstIsBetterThan, currentWorst];
  let middle2UpdateBetters = [...worstIsBetterThan, currentWorst];
  let middle1UpdateWorses = [...bestIsWorseThan, currentBest];
  let middle2UpdateWorses = [...bestIsWorseThan, currentBest];
  let worseUpdateWorses = [
    ...bestIsWorseThan,
    ...middle1IsWorseThan,
    ...middle2IsWorseThan,
    currentBest,
    currentMiddle1,
    currentMiddle2,
  ];
  let updateBettersArray = [
    { _id: currentBest, updateArray: bestUpdatesBetters },
    { _id: currentMiddle1, updateArray: middle1UpdateBetters },
    { _id: currentMiddle2, updateArray: middle2UpdateBetters },
  ];
  let updateWorsesArray = [
    { _id: currentMiddle1, updateArray: middle1UpdateWorses },
    { _id: currentMiddle2, updateArray: middle2UpdateWorses },
    { _id: currentWorst, updateArray: worseUpdateWorses },
  ];
  console.log(updateBettersArray);
  const updatePromises = [];
  for (let updateObject of updateBettersArray) {
    console.log('updateobject', updateObject.updateArray, listId);
    const updatePromise = User.updateOne(
      //this adds a new list
      { _id: "64e8f95c35b3cb20363ad4ed", "lists._id": listId, "lists.games._id": updateObject._id }, //user id hardcoded currently
      {
        $addToSet: {
          "lists.$.games.$.betterThan": updateObject.updateArray,
        },
      }
    );
    updatePromises.push(updatePromise);
  }
  for (let updateObject of updateWorsesArray) {
    const updatePromise = User.updateOne(
      //this adds a new list
      { _id: "64e8f95c35b3cb20363ad4ed", "lists._id": listId, "lists.games._id": updateObject._id }, //user id hardcoded currently
      {
        $push: {
          "lists.$.games.$.worseThan": {$each: updateObject.updateArray},
        },
      }
    );
    updatePromises.push(updatePromise);
  }

  try {
    await Promise.all(updatePromises);
    console.log("All updates completed successfully.");
  } catch (error) {
    console.error("Error updating betterThan arrays:", error);
  }

});




// currentBest: action.payload.best,
//         currentWorst: action.payload.worst,
//         randomGames: action.payload.randomGames,

module.exports = router;
