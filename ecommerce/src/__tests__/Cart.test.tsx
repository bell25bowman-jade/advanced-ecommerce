import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Cart from "../components/Cart";
import cartReducer, { CartItem } from "../store/cartSlice";

// Mock Firebase so Cart's checkout path doesn't try to import real SDK modules
jest.mock("../client/FireBaseConfig", () => ({
  auth: { currentUser: null },
  db: {},
  storage: {},
}));

// Mock the order service used inside handleCheckout
jest.mock("../store/orderService", () => ({
  createOrder: jest.fn(),
}));

const makeStore = (preloadedItems: CartItem[] = []) =>
  configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: { items: preloadedItems } },
  });

// ---------- Unit tests for Cart component ----------

describe("Cart – renders empty state", () => {
  test("shows empty cart message when no items are in the store", () => {
    const store = makeStore([]);
    render(
      <Provider store={store}>
        <Cart />
      </Provider>,
    );

    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
  });
});

describe("Cart – renders items and handles interactions", () => {
  const sampleItems: CartItem[] = [
    {
      id: "1",
      title: "Wireless Headphones",
      price: 49.99,
      count: 2,
      category: "electronics",
      description: "Great sound quality",
      image: "",
    },
    {
      id: "2",
      title: "Mechanical Keyboard",
      price: 89.95,
      count: 1,
      category: "electronics",
      description: "Tactile feedback",
      image: "",
    },
  ];

  test("renders item titles, prices, and correct totals", () => {
    const store = makeStore(sampleItems);
    render(
      <Provider store={store}>
        <Cart />
      </Provider>,
    );

    // Item titles
    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
    expect(screen.getByText("Mechanical Keyboard")).toBeInTheDocument();

    // Individual prices
    expect(screen.getByText("$49.99")).toBeInTheDocument();
    expect(screen.getByText("$89.95")).toBeInTheDocument();

    // Total item count: 2 + 1 = 3
    expect(screen.getByText("Total items: 3")).toBeInTheDocument();

    // Total price: 49.99*2 + 89.95*1 = 189.93
    expect(screen.getByText("Total price: $189.93")).toBeInTheDocument();
  });

  test("removes an item from the cart when Remove is clicked", () => {
    const store = makeStore([sampleItems[0]]);
    render(
      <Provider store={store}>
        <Cart />
      </Provider>,
    );

    fireEvent.click(screen.getByText("Remove"));

    // After removal the redux state should be empty
    expect(store.getState().cart.items).toHaveLength(0);
    // Cart switches to empty message
    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
  });

  test("updates item count when quantity input changes", () => {
    const store = makeStore([sampleItems[0]]);
    render(
      <Provider store={store}>
        <Cart />
      </Provider>,
    );

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "5" } });

    expect(store.getState().cart.items[0].count).toBe(5);
  });
});
