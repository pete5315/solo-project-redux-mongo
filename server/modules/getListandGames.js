const List = require("../models/list");
const Game = require("../models/game");

async function getListandGames(objectIdArray) {
  let aggregateResult;
  console.log("object id array", objectIdArray);
  try {
    aggregateResult = await List.aggregate([
      {
        $match: { _id: { $in: objectIdArray } },
      },
      {
        $lookup: {
          from: "games",
          localField: "games",
          foreignField: "_id",
          as: "gamesInfo",
        },
      },
      {
        $sort: { _id: 1 } // Sort the documents within the pipeline
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
      return aggregateResult;
    } else {
      console.log("No matching lists found.");
    }
  } catch (error) {
    console.error("Error during aggregation:", error);
  }
}
module.exports = getListandGames;
