import { create } from "zustand";
import { CustomerProductResponse } from "../types/CustomerProductResponse";
import { productsRepository } from "../repository/ProductRepository";

interface ProductsState {
  products: CustomerProductResponse[];
  loading: boolean;

  fetchProducts: (isRefresh?: boolean) => Promise<void>;
  clearProducts: () => void;
}

export const useProductsStore = create<ProductsState>()((set, get) => ({
  products: [],
  loading: false,

  fetchProducts: async (isRefresh) => {
    if (get().products.length > 0 && !isRefresh) return;
    set({ loading: true });

    try {
      const data = await productsRepository.getAllProducts();
      set({ products: data });
    } finally {
      set({ loading: false });
    }
  },

  clearProducts: () => set({ products: [] }),
}));
