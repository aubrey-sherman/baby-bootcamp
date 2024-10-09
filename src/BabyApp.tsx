import { useState, useEffect } from "react";
import { jwtDecode as decode } from "jwt-decode";
import { Navigate } from 'react-router-dom';
import BabyBootcampApi from "./api/api.js";
import RoutesList from './RoutesList.tsx';
import UserContext from './auth/UserContext.ts';
import NavBar from './NavBar.tsx';

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

  /** Logs in a user with a valid username and password.
  *
  * Updates state with token.
  * If login fails to authenticate, renders error message.
  */

  type tPayload = {
    username: string,
    // isAdmin: user.isAdmin === true
  };

  useEffect(
    function fetchUserDataOnLogin() {
    async function fetchUserData() {
      if (token) {
        try {
          let { username } = decode<tPayload>(token);
          BabyBootcampApi.token = token;
          let currentUser = await BabyBootcampApi.getCurrentUser(username);

          setCurrentUser({
            infoLoaded: true,
            data: currentUser
          });
        } catch (err) {
          console.error("fetchUserDataOnLogin: problem loading", err);
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
      fetchUserData();
    },
  [ token]
  );

  /** Logs out current user by resetting states. */
    function handleLogout() {
      setFeedingEntries(null);
      setCurrentUser({
        data: null,
        infoLoaded: true
      });
      setToken("");
      localStorage.clear();
      setErrors([]);
    }

  /** Signs up a user when given valid input data.
   *
   * Calls login function upon successful signup.
   */
  async function handleSignup({ username, password, firstName, lastName, email }) {
    const userData = {
      username,
      password,
      firstName,
      lastName,
      email
    };

    const apiToken = await BabyBootcampApi.registerUser(userData);
    setToken(apiToken);
    localStorage.setItem('token', apiToken);

    if (apiToken) {
      setToken(apiToken);
      <Navigate to={'/'} />;
    }
  }

  // TODO: Write function here for updating feeding times.

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
          // handleLogin={handleLogin}
          // handleSignup={handleSignup}
        />
      </UserContext.Provider>
    </div>
  );
}

export default BabyApp;