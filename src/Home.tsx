import LoginButton from "./LoginButton.tsx";
import NavBar from "./NavBar.tsx";
// import { useAuth0 } from '@auth0/auth0-react';

/** Home component
 *
 * App -> BabyApp -> Routes -> Home
*/
function Home() {
  console.log("* Home")
  // const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  return (
    <div className="Home">
      {isAuthenticated ? (
        <>
          <NavBar />
          <h1>Baby Bootcamp 👶🏻 🍼 🧸 💤  🗓️</h1>
          <h2>Welcome back!</h2>
          <p>Log Out</p>
        </>
      ) : (
        <>
          <h1>Baby Bootcamp 👶🏻 🍼 🧸 💤  🗓️</h1>
          <p>Log In</p>
        </>
      )}
    </div>
  );
}

export default Home;