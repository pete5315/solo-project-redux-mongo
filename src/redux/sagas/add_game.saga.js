import axios from "axios";
import { useSelector } from "react-redux";
import { put, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_USER" actions
function* newGame(action) {
  if (action.payload === null) {
    action.payload = 1;
  }
  console.log(action.payload);
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)  
    console.log(action.payload);

    yield axios.post(
      "/api/atlas/list/addgame/" + action.payload.listId,
      {
        newGame: action.payload.newGame,
        id: action.payload.id,
        url: action.payload.url,
        thumbnail: action.payload.thumbnail,
      },
      config
    );
    yield put({
      type: "GET_GAMES",
      payload: { listId: action.payload.listId },
    });
    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* getGames(action) {
  console.log(action.payload);
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    console.log(50, action.payload)
    let games = yield axios.get(
      "/api/atlas/list/games/" + action.payload.listId,
      config
    );
    console.log(games);
    let gamesToSet = [];
    for (let x of games.data.games) {
      console.log(x);
      gamesToSet.push({
        name: x.name,
        id: x.id,
        url: x.url,
        thumbnail: x.thumbnail,
      });
    }
    console.log(gamesToSet, 'gamesToSet');
    yield put({ type: "SET_GAMES", payload: gamesToSet });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* newGameSaga() {
  console.log("hello from add_game saga"),
    yield takeLatest("ADD_GAME", newGame);
  yield takeLatest("GET_GAMES", getGames);
}

export default newGameSaga;
