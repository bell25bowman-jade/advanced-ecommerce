import cartReducer, {
  addToCart,
  removeFromCart,
  updateCount,
  clearCart,
} from "../store/cartSlice";
import type { Product } from "../store/types/Products";

// cartSlice calls sessionStorage inside saveState / loadInitialState.
// jsdom provides sessionStorage, so no manual mock is needed.

const mockProduct: Product = {
  id: "prod-1",
  title: "Test Widget",
  price: 12.5,
  category: "tools",
  description: "A widget for testing",
  image: "widget.png",
};

const emptyState = { items: [] };

// ---------- Unit tests for cartSlice reducer ----------

describe("cartSlice – addToCart", () => {
  test("adds a new product with count 1", () => {
    const state = cartReducer(emptyState, addToCart(mockProduct));

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ ...mockProduct, count: 1 });
  });

  test("increments count when the same product is added again", () => {
    let state = cartReducer(emptyState, addToCart(mockProduct));
    state = cartReducer(state, addToCart(mockProduct));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].count).toBe(2);
  });

  test("adds multiple distinct products as separate items", () => {
    const second: Product = { ...mockProduct, id: "prod-2", title: "Gadget" };
    let state = cartReducer(emptyState, addToCart(mockProduct));
    state = cartReducer(state, addToCart(second));

    expect(state.items).toHaveLength(2);
  });
});

describe("cartSlice – removeFromCart", () => {
  test("removes the correct item by id", () => {
    let state = cartReducer(emptyState, addToCart(mockProduct));
    state = cartReducer(state, removeFromCart("prod-1"));

    expect(state.items).toHaveLength(0);
  });

  test("leaves other items untouched when removing one", () => {
    const second: Product = { ...mockProduct, id: "prod-2", title: "Gadget" };
    let state = cartReducer(emptyState, addToCart(mockProduct));
    state = cartReducer(state, addToCart(second));
    state = cartReducer(state, removeFromCart("prod-1"));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe("prod-2");
  });
});

describe("cartSlice – updateCount", () => {
  test("sets the item count to the specified value", () => {
    let state = cartReducer(emptyState, addToCart(mockProduct));
    state = cartReducer(state, updateCount({ id: "prod-1", count: 7 }));

    expect(state.items[0].count).toBe(7);
  });

  test("does not affect other items", () => {
    const second: Product = { ...mockProduct, id: "prod-2", title: "Gadget" };
    let state = cartReducer(emptyState, addToCart(mockProduct));
    state = cartReducer(state, addToCart(second));
    state = cartReducer(state, updateCount({ id: "prod-1", count: 10 }));

    expect(state.items.find((i) => i.id === "prod-2")?.count).toBe(1);
  });
});

describe("cartSlice – clearCart", () => {
  test("removes all items from the cart", () => {
    const second: Product = { ...mockProduct, id: "prod-2", title: "Gadget" };
    let state = cartReducer(emptyState, addToCart(mockProduct));
    state = cartReducer(state, addToCart(second));
    state = cartReducer(state, clearCart());

    expect(state.items).toHaveLength(0);
  });

  test("returns empty items when cart is already empty", () => {
    const state = cartReducer(emptyState, clearCart());
    expect(state.items).toHaveLength(0);
  });
});
