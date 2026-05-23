import { useState } from "react";
import { useDispatch } from "react-redux";
import { useCategories, useProducts } from "../products/useProducts";
import { addToCart } from "../store/cartSlice";
import type { Product } from "../types/Products";

const FALLBACK_IMG = "https://via.placeholder.com/150?text=No+Image";

export default function Home() {
  const [category, setCategory] = useState<string>("");
  const dispatch = useDispatch();

  const { data: categories = [] } = useCategories();
  const { data: products = [] } = useProducts(category || undefined);

  return (
    <div>
      <h1>Products</h1>

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div className="products-grid">
        {products.map((p: Product) => (
          <div key={p.id} className="product-card">
            <img
              src={p.image}
              onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
            />
            <h3>{p.title}</h3>
            <p>{p.category}</p>
            <p>${p.price}</p>
            <p>{p.description}</p>
            <p>Rating: {p.rating.rate}</p>

            <button onClick={() => dispatch(addToCart(p))}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
