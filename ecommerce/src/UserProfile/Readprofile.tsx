import { doc, getDoc } from "firebase/firestore";
import { db } from "../client/FireBaseConfig";
import type { UserProfile } from "./User";

export const getUserProfile = async (uid: string) => {
  const snap = await getDoc(doc(db, "users", uid));

  return snap.exists() ? (snap.data() as UserProfile) : null;
};
