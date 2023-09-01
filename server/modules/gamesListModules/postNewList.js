const List = require("../../models/list");
const User = require("../../models/user");
const mongoose = require("mongoose");

async function postNewList(user) {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Create a new list
      const newList = await List.create(
        [
          {
            // _id: newId + 1,
            completed: false,
            lastModifiedDate: new Date(),
            games: [],
          },
        ],
        { session }
      );
      console.log(newList[0]._id);
      // Update user's lists array
      await User.updateOne(
        { _id: "64e8f95c35b3cb20363ad4ed" },
        { $push: { lists: newList[0]._id } },
        { session }
      );
  
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  

}

module.exports = postNewList;