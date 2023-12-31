import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import AboutPage from "../AboutPage/AboutPage";
import UserPage from "../1-UserLists/1-UserPage/UserPage";
import InfoPage from "../InfoPage/InfoPage";
import LandingPage from "../LandingPage/LandingPage";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import "./App.css";
import AddGames from "../2-AddGames/1-AddGames/AddGames";
import RankGames from "../RankGames/RankGames";
import ListRankedGames from "../ListRankedGames/ListRankedGames";

import Divider from "@mui/material/Divider";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const currentList = useSelector((store) => store.currentList);
  const listComplete = useSelector((store) => store.listComplete);

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Nav />
        <Divider />
        <br></br>
        <Switch>
          {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
          <Redirect exact from="/" to="/home" />

          {/* Visiting localhost:3000/about will show the about page. */}
          <Route
            // shows AboutPage at all times (logged in or not)
            exact
            path="/about"
          >
            <AboutPage />
          </Route>

          {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}
          <Route exact path="/user">
            {/* <ProtectedRoute
            // logged in shows UserPage else shows LoginPage
            exact
            path="/user"
          > */}
            <UserPage />
          </Route>
          {/* </ProtectedRoute> */}

          <Route exact path="/info">
            {/* <ProtectedRoute
            // logged in shows InfoPage else shows LoginPage
            exact
            path="/info"
        >*/}
            <InfoPage />
          </Route>
          {/* </ProtectedRoute> */}

          {/* <ProtectedRoute
            // logged in shows AddGames page else shows LoginPage
            exact
            path="/inputs"
          > */}
          <Route exact path="/inputs">
            {!currentList ? <Redirect to="/user" /> : <AddGames />}
          </Route>
          {/* </ProtectedRoute> */}

          {/* <ProtectedRoute
            // logged in shows AddGames page else shows LoginPage
            exact
            path="/rank"
          > */}
          <Route exact path="/rank">
            {!currentList ? (
              // If the user is already logged in,
              // redirect to the /user page
              <Redirect to="/user" />
            ) : // Otherwise, show the login page
            !listComplete ? (
              // Otherwise, show the login page
              <RankGames />
            ) : (
              // If the user is already logged in,
              // redirect to the /user page
              <Redirect to="/list" />
            )}
          </Route>
          {/* </ProtectedRoute> */}

          {/* <ProtectedRoute
            // logged in shows AddGames page else shows LoginPage
            exact
            path="/list"
          > */}
          <Route exact path="/list">
            {!currentList ? (
              // If the user is already logged in,
              // redirect to the /user page
              <Redirect to="/user" />
            ) : listComplete ? (
              // Otherwise, show the login page
              <ListRankedGames />
            ) : (
              // If the user is already logged in,
              // redirect to the /user page
              <Redirect to="/rank" />
            )}
          </Route>
          {/* </ProtectedRoute> */}

          <Route exact path="/login">
            {user.id ? (
              // If the user is already logged in,
              // redirect to the /user page
              <Redirect to="/user" />
            ) : (
              // Otherwise, show the login page
              <LoginPage />
            )}
          </Route>

          <Route exact path="/registration">
            {user.id ? (
              // If the user is already logged in,
              // redirect them to the /user page
              <Redirect to="/user" />
            ) : (
              // Otherwise, show the registration page
              <RegisterPage />
            )}
          </Route>

          <Route exact path="/home">
            {user.id ? (
              // If the user is already logged in,
              // redirect them to the /user page
              <Redirect to="/user" />
            ) : (
              // Otherwise, show the Landing page
              <LandingPage />
            )}
          </Route>

          {/* If none of the other routes matched, we will show a 404. */}
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
