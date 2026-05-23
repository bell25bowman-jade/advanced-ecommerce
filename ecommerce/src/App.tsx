import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Cart from "./components/Cart";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

export default function App() {
  const items = useSelector((state: RootState) => state.cart.items);
  const totalCount = items.reduce((sum, i) => sum + i.count, 0);

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |<Link to="/cart">Cart ({totalCount})</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}
