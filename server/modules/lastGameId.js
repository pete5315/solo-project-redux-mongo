const User = require("../models/user");

async function lastGameId(listId) {
  try {
    const user = await User.findOne(
      {
        _id: "64e8f95c35b3cb20363ad4ed", // User ID hardcoded for now
        "lists._id": listId,
      },
      { "lists.$": 1 }
    );
    
    if (user && user.lists.length > 0) {
      const games = user.lists[0].games;
      const maxGameId = Math.max(...games.map(game => game._id), 0);
      console.log("max game id", maxGameId)
      return maxGameId;
    }
    
    return 0;
  } catch (error) {
    console.error("Error retrieving max game ID:", error);
    return 0;
  }
}
module.exports = lastGameId;


