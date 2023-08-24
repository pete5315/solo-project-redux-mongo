import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import "./GamesListItem.css";

function GamesListItem({ game, i }) {
  let dispatch = useDispatch();
  let currentList = useSelector((store) => store.currentList);
  function removeGame() {
    dispatch({
      type: "DELETE_GAME",
      payload: {
        game: game,
        listID: currentList.__listId,
        id: game.__gameId,
        getRandom: false,
      },
    });
  }

  return (
    <tr key={i}>
      <td>
        <span>
          <img className="image" src={game.url} />
        </span>
      </td>
      <td className="listImage" >{game.name}</td>
      <span className="icon">
        <DeleteIcon sx={{p: 1}} onClick={removeGame}>trash</DeleteIcon>{" "}
      </span>
    </tr>
  );
}

export default GamesListItem;
