import { useState, useEffect } from "react";
import { jwtDecode as decode } from "jwt-decode";

import { Navigate } from 'react-router-dom';
import BabyBootcampApi from "./api/api.js";
import RoutesList from './RoutesList.tsx';
import userContext from './userContext.ts';
import NavBar from './NavBar.tsx';

// NOTE: Not being used; review Jobly custom hook for storage
// export const TOKEN_STORAGE_ID = 'baby-token';

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
  async function handleLogin({ username: password}: {username: string; password: string }) {
    const apiToken = await BabyBootcampApi.logInUser({ username, password });

    if (apiToken) {
      setToken(apiToken);
      localStorage.setItem('token', apiToken);
      < Navigate to={"/"} />;
    }
  }

  useEffect(function fetchUserDataOnLogin() {
    async function fetchUserData() {
      if (token !== "") {
        const username = decode(token).username;
        const userData = await BabyBootcampApi.getUserDetails(username);

        if (userData) {
          setCurrentUser({
            username: username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            isAdmin: userData.isAdmin,
            applications: userData.applications
          });
        }
      }
    }
    fetchUserData();
  }, [token]);

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

  //FIXME: Modify sign up info based on registration form
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
      <userContext.Provider
        value={{
          currentUser: currentUser.data,
          setCurrentUser
        }}
      >
        <NavBar handleLogout={handleLogout} />
        <RoutesList
          currentUser={currentUser.data}
          handleLogin={handleLogin}
          handleSignup={handleSignup}
        />
      </userContext.Provider>
    </div>
  );
}

export default BabyApp;