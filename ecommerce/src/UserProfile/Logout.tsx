import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export const logoutUser = () => {
  return signOut(auth);
};

<button onClick={logoutUser}>Logout</button>;
