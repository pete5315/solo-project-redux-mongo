import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GamesListItem from "../3-GamesListItem/GamesListItem"

function AddedGames() {
  let list = useSelector((store) => store.currentList);

  if (list.gamesInfo && !list.gamesInfo[0]) {
    return
  }

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Game name</th>
        </tr>
      </thead>
      <tbody>
        {list.gamesInfo.map((game, i) => <GamesListItem game={game} i={i}/>)} 
      </tbody>
    </table>
  );
}

export default AddedGames