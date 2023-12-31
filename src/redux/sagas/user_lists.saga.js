import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUserLists(action) {
  console.log(action);
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const atlasResponse = yield axios.get("/api/atlas/list/" + "userid", config);
    console.log(atlasResponse);
    console.log(atlasResponse.data);

    yield put({ type: "SET_USER_LIST", payload: atlasResponse.data });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* fetchCurrentUserList(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    console.log(action);
    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const atlasResponse = yield axios.get("/api/atlas/list/userId/" + action.payload.listId, config);
    console.log(atlasResponse);
    console.log(atlasResponse.data);

    yield put({ type: "SET_CURRENT_LIST", payload: atlasResponse.data });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* setListIncomplete() {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    // yield axios.post(`/api/userlist/incomplete/${action.payload.id}`, data, config);
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* userListsSaga() {
  yield takeLatest("FETCH_USER_LISTS", fetchUserLists);
  yield takeLatest("FETCH_CURRENT_USER_LIST", fetchCurrentUserList);
  yield takeLatest("SET_LIST_INCOMPLETE", setListIncomplete);
}

export default userListsSaga;
