import { addDoc, collection } from "firebase/firestore";
import { db } from "../client/FireBaseConfig";
import type { CartItem } from "./cartSlice";

export interface CreateOrderPayload {
  userId: string;
  products: CartItem[];
  totalPrice: number;
}

export const createOrder = async ({
  userId,
  products,
  totalPrice,
}: CreateOrderPayload) => {
  const orderProducts = products.map((item) => ({
    productId: item.id,
    title: item.title,
    price: item.price,
    quantity: item.count,
    image: item.image,
  }));

  const ref = await addDoc(collection(db, "orders"), {
    userId,
    createdAt: Date.now(),
    totalPrice,
    products: orderProducts,
  });

  return ref.id;
};