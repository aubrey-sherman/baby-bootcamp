import LoginButton from "./LoginButton.tsx";
import NavBar from "./NavBar.tsx";
import { useAuth0 } from '@auth0/auth0-react';


function Home() {
  console.log("* Home")
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  return (
    <div className="Home">
      {isAuthenticated ? (
        <>
          <NavBar />
          <h1>Baby Bootcamp 👶🏻 🍼 🧸 💤  🗓️</h1>
          <h2>Welcome back, {user.name}!</h2>
          <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
        </>
      ) : (
        <>
          <h1>Baby Bootcamp 👶🏻 🍼 🧸 💤  🗓️</h1>
          <button onClick={loginWithRedirect}>Log In</button>
        </>
      )}
    </div>
  );
}

export default Home;