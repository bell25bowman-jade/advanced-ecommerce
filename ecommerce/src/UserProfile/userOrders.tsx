import { collection, getDocs, query, where } from "firebase/firestore";

export const getUserOrders = async (uid: string) => {
  const q = query(collection(db, "orders"), where("userId", "==", uid));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
