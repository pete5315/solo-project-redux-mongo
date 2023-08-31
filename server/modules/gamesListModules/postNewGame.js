const Game = require("../../models/game");
const List = require("../../models/list");
const mongoose = require("mongoose");

const getListandGames = require("../getListandGames");

async function postNewGame(listId, req) {
  console.log("in post new game");
  let updatedListId
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
    console.log("new game id", newGame[0]._id);
    // Update list's games array
    await List.updateOne(
      { _id: listId },
      { $push: { games: newGame[0]._id } },
      { session }
    );
    updatedListId = await List.findOne({ _id: listId }).session(session);
    console.log(32, updatedListId._id);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
  let listAndGames = await getListandGames([updatedListId._id]);
  return listAndGames;
}

module.exports = postNewGame;
