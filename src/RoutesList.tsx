import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import NavBar from "./NavBar.tsx";
import Home from "./Home.tsx";
import Eat from "./Eat.tsx";
import Sleep from "./Sleep.tsx";
import { tCurrentUser } from "./types.ts";

/** Routes for Baby App
 *
 * Props: WIP
 * State: WIP
 *
 * BabyApp ->
 *  RoutesList ->
 *    {Navigation, LoginForm, RegisterForm, Logout, Home, Eat, Sleep}
 */

function RoutesList({ currentUser }: { currentUser: tCurrentUser }) {
  console.log("* RoutesList");

  return (
    <div className="RoutesList">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        {/* {currentUser === null &&
            <>
              <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
              <Route path="/signup" element={<SignupForm handleSignup={handleSignup}  />} />
            </>
          } */}
          {currentUser !== null &&
            <>
            <Route path="/eat" element={<Eat />} />
            <Route path="/sleep" element={<Sleep />} />
            </>
          }
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )

}

export default RoutesList;