import { Link } from "react-router-dom";
import { useUserContext } from "./auth/UserContext.ts";
import "./Home.css";
import { CurrentUser, HomeProps } from "./types.ts";

/** Homepage for Baby Bootcamp
 *
 * App -> BabyApp -> Routes -> Home
*/
function Home({ currentUser }: HomeProps) {
  console.log("* Home", "currentUser=", currentUser);

  return (
    <div className="Home">
      <h1>Baby Bootcamp 👶🏻 🍼 🧸 💤  🗓️</h1>
      {currentUser !== null &&
        <h2>Welcome back, {currentUser.firstName} and {currentUser.babyName}!</h2>}
      {currentUser === null &&
        <>
          <Link to={'/login'}>Log In</Link>
          <Link to={'/signup'}>Sign Up</Link>
        </>
      }
    </div>
  );
}

export default Home;