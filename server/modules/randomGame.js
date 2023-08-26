const User = require("../models/user");

function randomGame(randomGameObject, fullGameArray) {
  console.log(randomGameObject);
  let filteredList = getFilteredList(randomGameObject.games, fullGameArray);
  if (filteredList.length < 1) {
    console.log("oops");
    return {
      maxRandomGameCount: randomGameObject.games.length,
      games: randomGameObject.games,
    };
  }
  randomGameObject.maxRandomGameCount =
    filteredList.length + randomGameObject.games.length > 4
      ? 4
      : filteredList.length + randomGameObject.games.length;
  console.log(
    "update max",
    randomGameObject.maxRandomGameCount,
    filteredList.length,
    randomGameObject.games.length
  );
  randomGameObject.games.push(
    filteredList[Math.floor(Math.random() * filteredList.length)]
  );
  console.log(randomGameObject.games);
  return randomGameObject;
}

function getFilteredList(randomGamesArray, fullGameArray) {
  let removeTheseGameIdsArray = [];
  for (let gameObject of randomGamesArray) {
    console.log(gameObject);
    removeTheseGameIdsArray.push(gameObject.__gameId);
    if (gameObject.betterThan.length > 0) {
      for (let gameId of gameObject.betterThan) {
        removeTheseGameIdsArray.push(gameId);
      }
    }
    if (gameObject.worseThan.length > 0) {
      for (let gameId of gameObject.worseThan) {
        removeTheseGameIdsArray.push(gameId);
      }
    }
  }
  console.log("remove ids", removeTheseGameIdsArray);
  let partialGameList = fullGameArray;
  let newArray = []
  for (let game of partialGameList) {
    if (!removeTheseGameIdsArray.includes(game.__gameId)) {
      console.log("it's FINE", game.__gameId)
      newArray.push(game);
    }
  }
  console.log("partial partial", newArray)
  return newArray;
}

module.exports = randomGame;
