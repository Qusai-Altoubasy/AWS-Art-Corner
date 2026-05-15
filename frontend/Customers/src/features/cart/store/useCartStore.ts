import { create } from "zustand";
import { CartItemResponse } from "../types/CartItemResponse";
import { cartRepository } from "../repository/CartRepository";
import { useOrderStore } from "../../orders/store/useOrderStore";

interface CartState {
  cart: CartItemResponse[];

  loading: {
    fetch: boolean;
    placeOrder: boolean;
    removeItem: Record<number, boolean>;
    addItem: Record<number, boolean>;
  };

  fetchCart: (isRefresh?: boolean) => Promise<void>;
  placeOrder: () => Promise<void>;
  clearCart: () => void;
  addItem: (productId: number, quantity: number) => Promise<string>;
  removeItem: (productId: number) => Promise<void>;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: [],

  loading: {
    fetch: false,
    placeOrder: false,
    removeItem: {},
    addItem: {},
  },

  fetchCart: async (isRefresh) => {
    if (get().cart.length > 0 && !isRefresh) return;
    set((state) => ({
      loading: { ...state.loading, fetch: true },
    }));

    try {
      const data = await cartRepository.getCartItems();
      set({ cart: data });
    } finally {
      set((state) => ({
        loading: { ...state.loading, fetch: false },
      }));
    }
  },

  placeOrder: async () => {
    set((state) => ({
      loading: { ...state.loading, placeOrder: true },
    }));

    try {
      await useOrderStore.getState().placeOrder();
      set({ cart: [] });
    } finally {
      set((state) => ({
        loading: { ...state.loading, placeOrder: false },
      }));
    }
  },

  removeItem: async (productId) => {
    set((state) => ({
      loading: {
        ...state.loading,
        removeItem: { ...state.loading.removeItem, [productId]: true },
      },
    }));

    try {
      await cartRepository.removeFromCart(productId);

      set((state) => ({
        cart: state.cart.filter((i) => i.productId !== productId),
      }));
    } finally {
      set((state) => ({
        loading: {
          ...state.loading,
          removeItem: { ...state.loading.removeItem, [productId]: false },
        },
      }));
    }
  },

  addItem: async (productId, quantity) => {
    set((state) => ({
      loading: {
        ...state.loading,
        addItem: { ...state.loading.addItem, [productId]: true },
      },
    }));

    try {
      const response = await cartRepository.addToCart({ productId, quantity });
      await get().fetchCart(true);
      return response;
    } finally {
      set((state) => ({
        loading: {
          ...state.loading,
          addItem: { ...state.loading.addItem, [productId]: false },
        },
      }));
    }
  },

  clearCart: () => set({ cart: [] }),
}));
