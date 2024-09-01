import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import NavBar from "./NavBar.tsx";
import Home from "./Home.tsx";
import Eat from "./Eat.tsx";
import Sleep from "./Sleep.tsx";
import LoginForm from "./LoginForm.tsx";
import RegisterForm from "./RegisterForm.tsx";

/** Routes for Baby App
 *
 * Props: WIP
 * State: WIP
 *
 * BabyApp ->
 *  RoutesList ->
 *    {Navigation, LoginForm, RegisterForm, Logout, Home, Eat, Sleep}
 */

function RoutesList() {
  console.log("* RoutesList");

  return (
    <div className="RoutesList">
      <BrowserRouter>
        /* <NavBar /> */
        <Routes>
          <Route path="eat" element={<Eat />} />
          <Route path="sleep" element={<Sleep />} />
          <Route path="home" element={<Home />} />
          {/* Choice: Include a NotFound/404 component or redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )

}

export default RoutesList;