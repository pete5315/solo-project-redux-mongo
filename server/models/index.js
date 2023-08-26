import mongoose from "mongoose";

import User from "./user";
import List from "./list";
import Game from "./game";
import Matchup from "./matchup";
import Result from "./result";

const connectDb = () => {
  return mongoose.connect(`${uri}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const models = { User, List, Game, Matchup, Result };

export { connectDb };

export default models;
