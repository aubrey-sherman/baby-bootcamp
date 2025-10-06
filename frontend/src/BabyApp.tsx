import { useState, useEffect } from "react";
import { jwtDecode as decode } from "jwt-decode";
import { BrowserRouter, Navigate } from 'react-router-dom';
import BabyBootcampApi from "./api/api.js";
import RoutesList from './RoutesList.tsx';
import Navigation from "./Navigation.tsx";
import { RegisterParams, CurrentUser } from "./types.ts";

/** Baby Bootcamp application.
 *
 * Props: none
 * State: currentUser => {
 *                        username,
 *                        firstName,
 *                        lastName,
 *                        email,
 *                        babyName
 *                       }
 *
 * Effect: fetches user's general data upon successful login.
 *
 * Baby Bootcamp -> RoutesList
 */
function BabyApp() {
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    data: null,
    infoLoaded: false
  });

  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Sets API token before state initialization.
  useEffect(() => {
    BabyBootcampApi.token = token;
  }, [token]);

  type Payload = {
    username: string
  };

  // Loads user info from API. Only runs when a user is logged in and has token.
  useEffect(() => {
      async function fetchCurrentUser() {
        if (token) {
          try {
            const { username } = decode<Payload>(token);

            const currentUserData = await BabyBootcampApi.getCurrentUser(username);

            setCurrentUser({
              infoLoaded: true,
              data: currentUserData
            });
          } catch (err) {
            console.error("Error fetching user data:", err);
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
  }, [token]);

  type LogInParams = {
    username: string;
    password: string;
  }

  /** Logs in a user with a valid username and password.
  *
  * Updates state with token.
  */
  async function logIn({ username, password }: LogInParams) {
    const apiToken = await BabyBootcampApi.logInUser({ username, password });
    localStorage.setItem('token', apiToken);
    setToken(apiToken);
    }

  /** Logs out current user site-wide by resetting states. */
    function logOut() {
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
  async function signUp(userData: RegisterParams) {

    try {
      const apiToken = await BabyBootcampApi.registerUser(userData);
      setToken(apiToken);
      localStorage.setItem('token', apiToken);
      <Navigate to={'/'} />;
    } catch (err) {
      console.error("Error during signup:", err);
      throw err;
    }
  }


  if (!currentUser.infoLoaded) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <div className="BabyApp">
          <Navigation
            currentUser={currentUser.data}
            logOut={logOut}
          />
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