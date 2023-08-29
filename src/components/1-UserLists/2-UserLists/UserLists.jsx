import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserListItem from "../3-UserListItem/UserListItem";

function UserLists() {
  useEffect(() => {
    getUserLists();
  }, []);

  let dispatch = useDispatch();

  const lists = useSelector((store) => store.userLists);
  const user = useSelector((store) => store.user);
  function getUserLists() {
    dispatch({
      type: "FETCH_USER_LISTS",
      payload: user,
    });
  }

  if (!lists[0]) {
    return
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Status</th>
          <th># of games</th>
          <th>List modified</th>
        </tr>
      </thead>
      <tbody>
        {lists && lists.map((list, i) => <UserListItem list={list} i={i} />)} 
        
      </tbody>
    </table>
  );
}

export default UserLists;
