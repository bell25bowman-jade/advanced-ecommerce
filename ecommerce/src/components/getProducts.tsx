import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../client/FireBaseConfig";
import type { Product } from "../store/types/Products";

export type ProductInput = Omit<Product, "id">;

export const getProducts = async () => {
  const snapshot = await getDocs(collection(db, "products"));

  return snapshot.docs.map((productDoc) => {
    const data = productDoc.data() as ProductInput;
    return {
      id: productDoc.id,
      ...data,
    };
  });
};

export const createProduct = async (payload: ProductInput) => {
  const ref = await addDoc(collection(db, "products"), payload);
  return ref.id;
};

export const updateProduct = async (
  id: string,
  payload: Partial<ProductInput>,
) => {
  await updateDoc(doc(db, "products", id), payload);
};

export const deleteProductById = async (id: string) => {
  await deleteDoc(doc(db, "products", id));
};
