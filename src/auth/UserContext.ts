import { createContext } from "react";

/** Context: provides currentUser object and setter for it throughout app. */

interface UserContextType {

}

// FIXME: needs a default value
const UserContext = createContext();

export default UserContext;