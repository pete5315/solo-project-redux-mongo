const User = require("../../models/user");

async function deleteList(userId, listId) {

    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      await List.findOneAndDelete({ _id: listId }, { session });
      await User.updateMany({}, { $pull: { lists: listId } }, { session });
      await session.commitTransaction();
    } catch (error) {
      console.error("Error deleting game:", error);
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
      return 200
    }
}

module.exports = deleteList;