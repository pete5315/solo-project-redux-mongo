const List = require("../models/list");
const Game = require("../models/game");

async function getListandGames(objectIdArray) {

let aggregateResult;
console.log(objectIdArray);
try {
  aggregateResult = await List.aggregate([
    {
      $match: { _id: { $in: objectIdArray } },
    },
    {
      $lookup: {
        from: "games", // Collection name for games
        localField: "games", // Array field in List collection
        foreignField: "_id", // Reference field in Game collection
        as: "gamesInfo", // Alias for the joined games
      },
    },
    {
      $project: {
        gamesInfo: 1,
        _id: 1,
        completed: 1,
        lastModifiedDate: 1,
        games: 1,
      },
    },
  ]);

  if (aggregateResult.length > 0) {
    console.log("Matching lists:", aggregateResult);
  } else {
    console.log("No matching lists found.");
  }
} catch (error) {
  console.error("Error during aggregation:", error);
}
return aggregateResult;
}
module.exports = getListandGames;