const User = require("../../models/user");
const getListandGames = require("../getListandGames");

async function getListsByUserId(userId) {
  let jsonResult, objectIdArray;
  // Get all lists
  await User.find({
    _id: "64e8f95c35b3cb20363ad4ed", //userId
  })
    .sort({ _id: 1 }) //will need to include the specific userid when authentication/login is working, hardcoded for now
    .then((documents) => {
      jsonResult = JSON.parse(JSON.stringify(documents, null, 2)); //this converts the cursor to object format
      userLists = jsonResult[0].lists;
      objectIdArray = documents[0].lists;
      // res.send(jsonResult[0].lists); //this should return the id of the newest list just added
    })
    .catch((error) => {
      console.error("Error fetching and converting documents:", error);
    });

  console.log("object id array 19", objectIdArray);
  let aggregateResult = await getListandGames(objectIdArray);
  console.log("aggregate result 21", aggregateResult);
  return aggregateResult;
}

module.exports = getListsByUserId;
