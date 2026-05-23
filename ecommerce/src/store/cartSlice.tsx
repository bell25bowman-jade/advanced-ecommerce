import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../types/Products";

export interface CartItem extends Product {
  count: number;
}

interface CartState {
  items: CartItem[];
}

const STORAGE_KEY = "cart";

const loadInitialState = (): CartItem[] => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveState = (state: CartItem[]) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const initialState: CartState = {
  items: loadInitialState(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.count += 1;
      } else {
        state.items.push({ ...action.payload, count: 1 });
      }
      saveState(state.items);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveState(state.items);
    },
    updateCount: (
      state,
      action: PayloadAction<{ id: number; count: number }>,
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.count = action.payload.count;
      saveState(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveState(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateCount, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
