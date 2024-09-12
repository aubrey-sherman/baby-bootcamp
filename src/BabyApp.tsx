import { useState, useEffect } from "react";
import { jwtDecode as decode } from "jwt-decode";

import BabyBootcampAPI from "./api/api.js";
import RoutesList from './RoutesList.tsx';

/** Baby Bootcamp application.
 *
 * Props: none
 *
 * Effect: fetches user's data upon successful login
 *
 * Baby Bootcamp -> RoutesList
 */
function BabyApp() {
  console.log("* BabyApp");
  const [currUser, setCurrUser] = useState(null);

  const savedToken = localStorage.getItem('token');
  BabyBootcampAPI.token = savedToken || '';
  const [token, setToken] = useState(savedToken || '');



  return (
    <div className="BabyApp">
      <RoutesList />
    </div>
  )

}

export default BabyApp;