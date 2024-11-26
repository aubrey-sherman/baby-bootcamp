import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home.tsx";
import Eat from "./Eat.tsx";
import LoginForm from "./LoginForm.tsx";
import SignupForm from "./SignupForm.tsx";
import { RoutesProps } from "./types.ts";

/** Routes for Baby App
 *
 * Props: WIP
 * State: WIP
 *
 * BabyApp ->
 *  RoutesList ->
 *    {Navigation, LoginForm, RegisterForm, Logout, Home, Eat, Sleep}
 */

function RoutesList({ currentUser, signUp, logIn }: RoutesProps) {

  return (
    <div className="RoutesList">
        <Routes>
          <Route path="/" element={<Home currentUser={currentUser} />} />
        {currentUser === null &&
            <>
              <Route path="/login" element={<LoginForm logIn={logIn} />} />
              <Route path="/signup" element={<SignupForm signUp={signUp}  />} />
            </>
          }
          {currentUser !== null &&
            <>
              <Route path="/eat" element={<Eat username={currentUser.username} babyName={currentUser.babyName} />} />
            </>
          }
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </div>
  )

}

export default RoutesList;