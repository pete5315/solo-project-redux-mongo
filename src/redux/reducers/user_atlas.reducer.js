const userAtlasReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER_ATLAS':
      return action.payload;
    case 'UNSET_USER_ATLAS':
      return {};
    default:
      return state;
  }
};

export default userAtlasReducer;