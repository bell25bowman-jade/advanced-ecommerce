/**
 * Integration test: adding a product to the cart updates the Cart component.
 *
 * This test wires together:
 *   - A real Redux store (cartSlice reducer)
 *   - A ProductCard component that dispatches addToCart
 *   - The real Cart component that reads from the same store
 *
 * It verifies the full data-flow: user action → Redux state → UI update.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { Provider, useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Cart from "../components/Cart";
import cartReducer from "../store/cartSlice";
import { addToCart } from "../store/cartSlice";
import type { Product } from "../store/types/Products";

// ── Mocks ──────────────────────────────────────────────────────────────────
jest.mock("../client/FireBaseConfig", () => ({
  auth: { currentUser: null },
  db: {},
  storage: {},
}));

jest.mock("../store/orderService", () => ({
  createOrder: jest.fn(),
}));

// ── Helpers ────────────────────────────────────────────────────────────────
const makeStore = () => configureStore({ reducer: { cart: cartReducer } });

const sampleProduct: Product = {
  id: "int-p1",
  title: "Integration Widget",
  price: 24.99,
  category: "general",
  description: "Used in integration tests",
  image: "",
};

/** Minimal product card that dispatches addToCart on click. */
function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch();
  return (
    <div>
      <span>{product.title}</span>
      <span>${product.price.toFixed(2)}</span>
      <button onClick={() => dispatch(addToCart(product))}>Add to Cart</button>
    </div>
  );
}

// ── Tests ──────────────────────────────────────────────────────────────────
describe("Integration: ProductCard → Cart", () => {
  test("cart shows product after clicking Add to Cart", () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <ProductCard product={sampleProduct} />
        <Cart />
      </Provider>,
    );

    // Initially the cart is empty
    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();

    // User clicks Add to Cart
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));

    // Cart now shows the product (title appears in both card + cart)
    expect(screen.getAllByText("Integration Widget")).toHaveLength(2);
    expect(screen.getAllByText("$24.99")).toHaveLength(2); // card + cart
    expect(screen.getByText("Total items: 1")).toBeInTheDocument();
    expect(screen.getByText("Total price: $24.99")).toBeInTheDocument();
  });

  test("cart total increments when same product is added twice", () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <ProductCard product={sampleProduct} />
        <Cart />
      </Provider>,
    );

    const addBtn = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addBtn);
    fireEvent.click(addBtn);

    expect(screen.getByText("Total items: 2")).toBeInTheDocument();
    // quantity input should reflect count = 2
    expect(screen.getByRole("spinbutton")).toHaveValue(2);
  });

  test("removing the only item restores empty cart message", () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <ProductCard product={sampleProduct} />
        <Cart />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    // Product appears in both card and cart after adding
    expect(screen.getAllByText("Integration Widget")).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: /remove/i }));
    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
    // Title still appears in the product card
    expect(screen.getAllByText("Integration Widget")).toHaveLength(1);
  });
});
