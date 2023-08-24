import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import xml2js from "xml2js";
import React, { useState } from "react";
import { Gamepad } from "@mui/icons-material";

function* addGameAsync(game) {
  yield put({ type: 'ADD_GAME', payload: game });
}

// worker Saga: will be fired on "FETCH_USER" actions
function* getBGG(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)




    let BGGresponse = yield axios.get(
      `https://boardgamegeek.com/xmlapi2/collection?username=${action.payload.bgg}&own=[0,1]&played=[0,1]`,
      {
        params: { format: "xml", paymentType: "ach" },
        responseType: "document",
      }
    );
    console.log(action.payload)
    yield console.log(BGGresponse.status);
    if (BGGresponse.status===200) {
      BGGresponse = BGGresponse.data.all;
      let currentObject = { listId: action.payload.id.__listId };
      let jitterator = 0;
      let collection = [];
      for (let i = 2; i < BGGresponse.length; i++) {
        if (BGGresponse[i].tagName === "name") {
          currentObject.newGame = BGGresponse[i].textContent;
          jitterator++;
        }
        if (BGGresponse[i].tagName === "thumbnail") {
          currentObject.thumbnail = BGGresponse[i].textContent;
          jitterator++;
        }
        if (BGGresponse[i].tagName === "image") {
          currentObject.url = BGGresponse[i].textContent;
          jitterator++;
        }
        if (jitterator === 3) {
          collection.push(currentObject);
          currentObject = { listId: action.payload.id.__listId };
          jitterator = 0;
        }
      }
    //   for (let game of collection) {
    //     console.log(game);
    //     yield call(addGameAsync, game);
    // }
    yield axios.post(
      "/api/atlas/list/addmanygames/" + action.payload.id.__listId,
      {
        collection
      },
      config
    );
    yield put({
      type: "GET_GAMES",
      payload: { listId: action.payload.id.__listId },
    });
  }
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* getBGGSaga() {
  yield takeLatest("GET_BGG", getBGG);
}

export default getBGGSaga;
