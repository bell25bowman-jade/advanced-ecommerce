import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJkAwj5_--IrzrXbj09-KG8MkfPClNhys",
  authDomain: "ecommerce-57265.firebaseapp.com",
  projectId: "ecommerce-57265",
  storageBucket: "ecommerce-57265.firebasestorage.app",
  messagingSenderId: "69335337864",
  appId: "1:69335337864:web:406f83c34cf3346a68083d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
