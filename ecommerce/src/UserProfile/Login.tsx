import { signInWithEmailAndPassword } from "firebase/auth";
import type { Auth } from "firebase/auth";

export const loginUser = (auth: Auth, email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};
