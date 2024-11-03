import { useState, useEffect } from "react";
import { jwtDecode as decode } from "jwt-decode";
import { BrowserRouter, Navigate } from 'react-router-dom';
import BabyBootcampApi from "./api/api.js";
import RoutesList from './RoutesList.tsx';
import Navigation from "./Navigation.tsx";
import { RegisterParams } from "./types.ts";

/** Baby Bootcamp application.
 *
 * Props: none
 * State: currentUser => {
 *                        username,
 *                        firstName,
 *                        lastName,
 *                        isAdmin,
 *                        email,
 *                        feedingEntries = [{}, {}, {}, ...]
 *                       }
 *
 * Effect: fetches user's data upon successful login
 *
 * Baby Bootcamp -> RoutesList
 */
function BabyApp() {
  const [feedingEntries, setFeedingEntries] = useState(null);

  const [currentUser, setCurrentUser] = useState({
    data: null,
    infoLoaded: false
  });

  const savedToken = localStorage.getItem('token');
  BabyBootcampApi.token = savedToken || '';
  const [token, setToken] = useState(savedToken || '');

  type Payload = {
    username: string
  };

  // Loads user info from API. Only runs when a user is logged in and has token.
  useEffect(
    function loadUserData() {

      async function fetchCurrentUser() {
        if (token !== '') {
          try {
            let { username } = decode<Payload>(token);
            // BabyBootcampApi.token = token;
            let currentUser = await BabyBootcampApi.getCurrentUser(username);

            setCurrentUser({
              infoLoaded: true,
              data: currentUser
            });
          } catch (err) {
            setCurrentUser({
              infoLoaded: true,
              data: null
            });
          }
        } else {
          setCurrentUser({
              infoLoaded: true,
              data: null
            });
          }
        }
        fetchCurrentUser();
      },
    [token]
  );

  type LogInParams = {
    username: string;
    password: string;
  }

  /** Logs in a user with a valid username and password.
  *
  * Updates state with token.
  *
  * If login fails to authenticate, renders error message.
  */
  async function logIn({ username, password }: LogInParams) {
    const apiToken = await BabyBootcampApi.logInUser({ username, password });
    localStorage.setItem('token', apiToken);
    setToken(apiToken);
    }

  /** Logs out current user site-wide by resetting states. */
    function logOut() {
      setFeedingEntries(null);
      setCurrentUser({
        infoLoaded: true,
        data: null
      });
      setToken("");
      localStorage.clear();
    }

  /** Signs up a user when given valid input data.
   *
   * Calls login function upon successful signup.
   */
  async function signUp(
    { username, password, firstName, lastName, email, babyName }: RegisterParams) {

    const userData = {
      username,
      password,
      firstName,
      lastName,
      email,
      babyName
    };

    const apiToken = await BabyBootcampApi.registerUser(userData);
    setToken(apiToken);
    localStorage.setItem('token', apiToken);
    <Navigate to={'/'} />;
    }

  if (!currentUser.infoLoaded) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <div className="BabyApp">
          <Navigation currentUser={currentUser.data} logOut={logOut} />
          <RoutesList
            currentUser={currentUser.data}
            signUp={signUp}
            logIn={logIn}
          />
      </div>
    </BrowserRouter>
  );
}

export default BabyApp;