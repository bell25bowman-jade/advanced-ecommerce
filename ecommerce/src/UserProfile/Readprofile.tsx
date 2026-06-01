import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const getUserProfile = async (uid: string) => {
  const snap = await getDoc(doc(db, "users", uid));

  return snap.data();
};
