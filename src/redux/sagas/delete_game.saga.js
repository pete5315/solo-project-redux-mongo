import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* deleteGame(action) {
  console.log(action.payload);
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    yield axios.delete("/api/atlas/list/deletegame/" + action.payload.listID + "/" + action.payload.gameId, config);
    if (action.payload.getRandom) {
      yield put({
        type: "GET_RANDOM_GAMES",
        payload: {
          currentList: {id: action.payload.listID},
          callbackHistory: action.payload.callbackHistory,
        },
      });
    }
    yield put({
      type: "FETCH_CURRENT_USER_LIST",
      payload: {
        listId: action.payload.listID,
      },
    });
    yield put({
      type: "UNSET_RANK",
    });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* deleteGameSaga() {
  yield takeLatest("DELETE_GAME", deleteGame);
}

export default deleteGameSaga;
