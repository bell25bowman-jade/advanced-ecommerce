import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../client/FireBaseConfig";

export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};
