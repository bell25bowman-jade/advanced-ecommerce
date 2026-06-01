import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth";
import Home from "./components/Home";
import Cart from "./components/Cart";
import OrderHistory from "./store/orderHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { auth } from "./client/FireBaseConfig";

export default function App() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const items = useSelector((state: RootState) => state.cart.items);
  const totalCount = items.reduce((sum, i) => sum + i.count, 0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });

    return unsubscribe;
  }, []);

  return (
    <BrowserRouter>
      <nav className="top-nav">
        <Link to="/">Home</Link>
        {" | "}
        {user ? (
          <>
            <Link to="/cart">Cart ({totalCount})</Link>
            {" | "}
            <Link to="/orders">Orders</Link>
          </>
        ) : (
          <>
            <span className="nav-disabled" title="Login required">
              Cart ({totalCount})
            </span>
            {" | "}
            <span className="nav-disabled" title="Login required">
              Orders
            </span>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
