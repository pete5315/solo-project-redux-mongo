import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

function UserListItem({ list, i }) {
  let dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  function setCurrentList() {
    dispatch({
      type: "SET_CURRENT_LIST",
      payload: list,
    });
    dispatch({
      type: "UNSET_RANDOM_GAMES",
    });
  }

  function removeList() {
    dispatch({
      type: "DELETE_LIST",
      payload: {
        listId: list._id,
        user
      },
    });
  }

  return (
    <tr key={list.listId} onClick={setCurrentList}>
      <td>
        <Link to="/inputs" className="text-color">
          <div>{list.completed ? "Completed" : "Incomplete"}</div>
        </Link>
      </td>
      <td>{list.games && list.games.length && list.games.length}</td>
      {/* <td>
        {list.date.slice(5, 7) +
          "-" +
          list.date.slice(8, 10) +
          "-" +
          list.date.slice(0, 4)}
      </td> */}
      <td>
        <Button
          variant="text"
          sx={{
            color: "grey",
            "&:hover": {
              color: "rgb(108, 108, 108)",
            },
          }}
          onClick={removeList}
        >
          <DeleteIcon></DeleteIcon>
        </Button>
      </td>
    </tr>
  );
}

export default UserListItem;
