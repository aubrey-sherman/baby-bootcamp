import { useState, useEffect } from "react";
import { jwtDecode as decode } from "jwt-decode";
import { Navigate } from 'react-router-dom';
import BabyBootcampApi from "./api/api.js";
import RoutesList from './RoutesList.tsx';
import UserContext from './auth/UserContext.ts';
import { tRegisterParams } from "./types.ts";

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

  console.debug(
    "BabyApp",
    "feedingEntries=",
    feedingEntries,
    "currentUser=",
    currentUser,
    "token=",
    token
  );

  // Loads user info from API. Only runs when a user is logged in and has token.
  useEffect(
    function loadUserData() {
      console.debug('useEffect running', "token=", token);

      async function fetchCurrentUser() {
        if (token !== '') {
          try {
            let { username } = decode<tPayload>(token);
            // BabyBootcampApi.token = token;
            let currentUser = await BabyBootcampApi.getCurrentUser(username);

            setCurrentUser({
              infoLoaded: true,
              data: currentUser
            });
          } catch (err) {
            console.error("loadUserData: problem loading", err);
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

  type tLogInParams = {
    username: string;
    password: string;
  }

  /** Logs in a user with a valid username and password.
  *
  * Updates state with token.
  *
  * If login fails to authenticate, renders error message.
  */
  async function logIn({ username, password }: tLogInParams) {
    const apiToken = await BabyBootcampApi.logInUser({ username, password });
    localStorage.setItem('token', apiToken);
    setToken(apiToken);
    }

  type tPayload = {
    username: string
  };

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
    { username, password, firstName, lastName, email }: tRegisterParams) {
    console.log("signUp function called")

    const userData = {
      username,
      password,
      firstName,
      lastName,
      email
    };
    console.debug("userData=", userData);

    const apiToken = await BabyBootcampApi.registerUser(userData);
    setToken(apiToken);
    localStorage.setItem('token', apiToken);
    <Navigate to={'/'} />;
    }

  if (!currentUser.infoLoaded) return <p>Loading...</p>;

  return (
    <div className="BabyApp">
      <UserContext.Provider
        value={{ currentUser: currentUser.data,
          setCurrentUser
         }}>
        {/* <NavBar handleLogout={handleLogout} /> */}
        <RoutesList
          currentUser={currentUser.data}
          signUp={signUp}
          logIn={logIn}
        />
      </UserContext.Provider>
    </div>
  );
}

export default BabyApp;