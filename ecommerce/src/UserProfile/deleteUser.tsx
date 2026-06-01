import { deleteDoc, doc } from "firebase/firestore";
import { deleteUser, type User } from "firebase/auth";
import { db } from "../client/FireBaseConfig";

export const removeAccount = async (user: User) => {
  await deleteDoc(doc(db, "users", user.uid));

  await deleteUser(user);
};
