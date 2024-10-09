import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "./auth/UserContext.ts";
import "./Home.css";

/** Homepage for Baby Bootcamp
 *
 * App -> BabyApp -> Routes -> Home
*/
function Home() {
  const { user } = useContext(UserContext);
  console.log("* Home");

  return (
    <div className="Home">
      <h1>Baby Bootcamp 👶🏻 🍼 🧸 💤  🗓️</h1>
      {user && <h2>Welcome back, {user.firstName || 'friend'}!</h2>}
      {!user &&
        <>
          <Link to={'/login'}>Log In</Link>
          <Link to={'/signup'}>Sign Up</Link>
        </>
      }
    </div>
  );
}

export default Home;