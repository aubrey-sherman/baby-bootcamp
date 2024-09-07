import LogoutButton from "./LogoutButton.tsx";
import { Link } from "react-router-dom";

function NavBar() {
  console.log("* NavBar");

  return (
    <nav className="NavBar">
      <Link to="/"> Home </Link>
      <Link to="/eat"> Eat </Link>
      <Link to="/sleep"> Sleep </Link>
      {/* <LogoutButton /> */}
    </nav>
  );
}

export default NavBar;