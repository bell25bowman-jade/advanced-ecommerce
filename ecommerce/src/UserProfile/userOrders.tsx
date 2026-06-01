import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../client/FireBaseConfig";

export interface OrderProduct {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface UserOrder {
  id: string;
  userId: string;
  createdAt: number;
  totalPrice: number;
  products: OrderProduct[];
}

export const getUserOrders = async (uid: string) => {
  const q = query(collection(db, "orders"), where("userId", "==", uid));

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((orderDoc) => {
      const data = orderDoc.data() as Omit<UserOrder, "id">;
      return {
        id: orderDoc.id,
        ...data,
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
};
