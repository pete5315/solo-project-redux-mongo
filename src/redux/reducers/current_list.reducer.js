const currentList = (state = null, action) => {
  switch (action.type) {
    case "SET_CURRENT_LIST":
      let update = action.payload;
      update.gamesInfo.sort((a, b) => a.name.localeCompare(b.name)); //sort the gamesinfo list, locale compare uses local sorting rules

      console.log(update);
      if (action.payload.length === 1) {
        //initial list gets set as an array, need it to be an int
        update = update[0];
      }

      return update;
    case "UNSET_CURRENT_LIST":
      return null;
    default:
      return state;
  }
};

export default currentList;
