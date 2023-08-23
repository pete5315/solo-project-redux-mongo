const User = require("../models/user")


async function lastListId(id) {
  let result
  await User.find( //grab all the lists for the user
    {
      _id: '64e6493ce50dc851f964407d', //user is hardcoded, should be replaced with id
    }
  )
  .then(documents => {
    const jsonResult = JSON.parse(JSON.stringify(documents, null, 2)); //this converts the cursor to object format
    result = jsonResult[0].lists.pop().__listId;
    console.log("result", result);
  })
  .catch(error => {
    console.error('Error fetching and converting documents:', error);
    result = -1;
  })
  return result; //this should return the id of the newest list just added
}
module.exports = lastListId;
