import { deleteDoc, doc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";

export const removeAccount = async (user: any) => {
  await deleteDoc(doc(db, "users", user.uid));

  await deleteUser(user);
};
