const User = require("../models/user")


async function newList(id) {
  await User.find( //grab all the lists for the user
    {
      _id: '64e3ebbab324bb30511206c6',
    }
  )
  .then(documents => {
    const jsonResult = JSON.parse(JSON.stringify(documents, null, 2)); //this converts the cursor to object format
    return jsonResult[0].lists.pop()._id; //this should return the id of the newest list just added
  })
  // .then(cursor => cursor.toArray()) // Convert cursor to array
  // .then(documents => {
  //   const jsonResult = JSON.stringify(documents, null, 2);
  //   console.log(jsonResult);
  // })
  .catch(error => {
    console.error('Error fetching and converting documents:', error);
  });

  // console.log("listids", listIds)
  // return newListId;
}
module.exports = newList;
