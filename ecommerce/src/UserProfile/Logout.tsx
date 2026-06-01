import { signOut } from "firebase/auth";
import { auth } from "../client/FireBaseConfig";

export const logoutUser = () => {
  return signOut(auth);
};
