import { Link } from "react-router-dom";
import { NavigationProps } from "./types.ts";
import './Navigation.css';

/** Navigation bar for site that is shown on every page.
 *
 * When user is logged in, shows links to main areas of site.
 *
 * BabyApp -> Navigation
 */
function Navigation({ currentUser, logOut }: NavigationProps) {

  function loggedInNavigation() {
    return (
    <>
      <Link to="/"> Home </Link>
      <Link to="/eat"> Eat </Link>
      <Link to="/sleep"> Sleep </Link>
      <Link to="/logout" onClick={logOut}> Log out</Link>
    </>
    );
  }

  return (
    <nav className="Navigation">
      {currentUser && loggedInNavigation()}
    </nav>
  );
}

export default Navigation;