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

// Import modules
const getListsByUserId = require("../modules/gamesListModules/getListsByUserId");
const deleteGame = require("../modules/gamesListModules/deleteGame");
const deleteList = require("../modules/gamesListModules/deleteList");
const getGamesByListId = require("../modules/gamesListModules/getGamesByListId");
const postManyNewGames = require("../modules/gamesListModules/postManyNewGames");
const postNewGame = require("../modules/gamesListModules/postNewGame");
const postNewList = require("../modules/gamesListModules/postNewList");

// Define your routes and endpoints

//get all lists for a particular user
router.get("/:userId", async (req, res) => {
  console.log(32);
  let userId = req.params.userId;
  res.send(await getListsByUserId(userId));
});

//get the games from a particular list
router.get("/userId/:listId", async (req, res) => {
  const listId = req.params.listId;
  const userId = req.params.userId;
  // const userId = req.params.user.Id;
  console.log(userId);
  let list = getGamesByListId(listId, userId);
  if (list && list.length > 0) {
    const list = user.lists[0];
    return res.status(200).json(list);
  } else {
    return res.status(404).send("List not found");
  }
});

router.post("/", async (req, res) => {
  //make a new list
  console.log("requser42", req.user);
  let user = req.user;
  // let newId = await lastListId(req.params.id);
  // console.log(newId, "newid")
  postNewList(user);
  res.sendStatus(200);
});

//add a new game to a particular list
router.post("/addgame/:listId", async (req, res) => {
  console.log("reqbody72", req.body);
  console.log("listid");

  // Add a new list
  let listId = req.params.listId;
  console.log("listid", listId);
  try {
    console.log("in try block");
    let response = await postNewGame(listId, req);
    console.log("73 response", response);
    res.send(response);
  } catch (error) {
    console.error("Error in postNewGame:", error);
    // Handle the error and send an appropriate response
    res.status(500).send("An error occurred");
  }
});

router.post("/addmanygames/:listId", async (req, res) => {
  let newGames = req.body.collection;
  let listId = req.params.listId;
  postManyNewGames(newGames, listId);
  console.log("sending a 200 status after posting many games")
  res.sendStatus(200);
});

// Delete a list by ID
router.delete("/:userId/:listId", async (req, res) => {
  const { userId, listId } = req.params;
  res.sendStatus(deleteList(userId, listId));
});

// Delete a game from a list
router.delete("/deletegame/:listId/:gameId", async (req, res) => {
  const listId = req.params.listId;
  const gameId = req.params.gameId;
  res.sendStatus(deleteGame(listId, gameId));
});

module.exports = router;
