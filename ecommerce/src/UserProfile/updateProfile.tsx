import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const updateUserProfile = async (
  uid: string,
  data: {
    name: string;
    address: string;
  },
) => {
  await updateDoc(doc(db, "users", uid), data);
};
