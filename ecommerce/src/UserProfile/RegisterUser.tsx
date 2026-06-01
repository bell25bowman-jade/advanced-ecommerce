import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../client/FireBaseConfig";

export const registerUser = async (email: string, password: string) => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = credential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    name: "",
    address: "",
  });

  return user;
};
