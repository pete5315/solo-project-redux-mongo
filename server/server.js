const express = require('express');
const mongoose = require("mongoose");
const uri = require("../atlas_uri");
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

const port = 3000;

// Route includes
const userRouter = require('./routes/user.router');
// const userListRouter = require('./routes/userlist.router');
// const newListRouter = require('./routes/newlist.router');
// const addGameRouter = require('./routes/addgame.router');
// const randomGameRouter = require('./routes/randomgame.router');
// const updateRankRouter = require('./routes/updaterank2.router');
// const rankedListRouter = require('./routes/newlist.router');
// const finishedListRouter = require('./routes/finishedlist.router')
// const editFinishedListRouter = require('./routes/editfinishedlist.router')
// const deleteGameRouter = require('./routes/deletegame.router')
// const deleteListRouter = require('./routes/deletelist.router')

const userAtlasRouter = require('./routes/userAtlas.router.js');
const gamesListRouter = require('./routes/gamesList.router.js');
const randomGamesRouter = require('./routes/randomGames.router')
const updateRankRouter = require('./routes/updateRank.router')
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// Connect to the MongoDB Atlas database
mongoose.connect(
  `${uri}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
// app.use('/api/userlist', userListRouter);
// app.use('/api/newlist', newListRouter);
// app.use('/api/addgame', addGameRouter);
// app.use('/api/randomgames', randomGameRouter);
// app.use('/api/updaterank', updateRankRouter);
// app.use('/api/rankedlist', rankedListRouter);
// app.use('/api/finishedlist', finishedListRouter);
// app.use('/api/editfinishedlist', editFinishedListRouter);
// app.use('/api/deletegame', deleteGameRouter);
// app.use('/api/deletelist', deleteListRouter);

app.use('/api/atlas/user', userAtlasRouter);
app.use('/api/atlas/list', gamesListRouter);
app.use('/api/atlas/randomgames', randomGamesRouter);
app.use('/api/atlas/updaterank', updateRankRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
