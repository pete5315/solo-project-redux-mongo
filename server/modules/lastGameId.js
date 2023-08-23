const User = require("../models/user");

async function lastGameId(listId) {
  let result;
  console.log(listId);
    const user = await User.findById("64e6493ce50dc851f964407d");
    const list = user.lists.find(
      (list) => list.__listId === parseInt(listId, 10)
    );
    const games = list.games;
    result = games.length>0 ? games.pop().__gameId : -1;
  return result //this should return the id of the last game added
}
module.exports = lastGameId;
