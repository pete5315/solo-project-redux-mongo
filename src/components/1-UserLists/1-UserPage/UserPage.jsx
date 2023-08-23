import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLists from "../2-UserLists/UserLists";
import { useHistory } from "react-router-dom/";
import "./UserPage.css";

function UserPage() {
  const user = useSelector((store) => store.user);
  const callbackHistory = useHistory();
  let dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 0 });
  }, []);

  function newList() {
    dispatch({
      type: "SET_NEW_LIST",
      payload: { callbackHistory },
    });
  }

  function newList2() {
    dispatch({
      type: "FETCH_USER_LISTS",
    });
  }

  return (
    <div className="container text-color">
      <h2>Welcome, {user.username}!</h2>
      {/* <p>Your ID is: {user.id}</p> */}
      <button onClick={newList}>Create a new list!</button>
      <button onClick={newList2}>Fetch user lists!</button>
      <UserLists />
      {/* <LogOutButton className="btn" /> */}
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
