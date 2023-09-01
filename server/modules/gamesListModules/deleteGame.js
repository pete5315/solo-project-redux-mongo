const List = require("../../models/list");

async function deleteList(listId, gameId) {
    console.log("in delete route", listId, gameId);
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      await List.updateOne(
        { _id: listId },
        { $pull: { games: { $in: [gameId] } } },
        { session },
        (err, result) => {
          if (err) {
            console.error("Error:", err);
          } else {
            console.log("Games removed:", result);
          }
        }
      );
      await session.commitTransaction();
    } catch (error) {
      console.error("Error deleting game:", error);
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
    return 200;

}

module.exports = deleteList;