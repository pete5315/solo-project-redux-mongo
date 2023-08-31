const List = require("../../models/list");
const Game = require("../../models/game");

async function getGamesByListId(listId, userId) {
    let list;
    try {
        list = await List.findOne(
      {
        _id: "64e8f95c35b3cb20363ad4ed", // User ID hardcoded for now
        "lists._id": listId,
      },
      { "lists.$": 1 }
    ).sort({ name: 1 });
  } catch (error) {
    console.error("Error retrieving list:", error);
    return res.status(500).send("Error retrieving list");
  } finally {
    return list;
  }
}

module.exports = getGamesByListId;
