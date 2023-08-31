const List = require("../models/list");

async function lastListId(id) {
  let result = 0;
  await List.find(
    //grab all the lists for the user

  )
    .then((documents) => {
      const jsonResult = JSON.parse(JSON.stringify(documents, null, 2)); //this converts the cursor to object format
      console.log("json result pop", jsonResult.pop());
      result = jsonResult.pop()._id;
      console.log("result", result);
    })
    .catch((error) => {
      console.error("Error fetching and converting documents:", error);
      result = -1;
    });
  return result || -1; //this should return the id of the newest list just added
}
module.exports = lastListId;
