const Game = require("../../models/game");
const List = require("../../models/list");
const mongoose = require("mongoose");

async function postManyNewGames(newGames, listId) {
    console.log("many new games", newGames.length, "new games posted");
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

      // Update list's games array
      for (let addedGame of addedGamesArray) {
        await List.updateOne(
          { _id: listId },
          { $push: { games: addedGame[0]._id } },
          { session }
        );
      }
      await session.commitTransaction();
    } catch (error) {
      console.log('error 37', error);
      await session.abortTransaction();
      throw error;
    } finally {
      console.log('success 41')
      session.endSession();
    }
    console.log("many games added complete");

}

module.exports = postManyNewGames;