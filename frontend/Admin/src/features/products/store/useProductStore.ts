import { create } from "zustand";
import { AdminProductResponse } from "../types/AdminProductResponse";
import { productsRepository } from "../repository/ProductRepository";
import { ProductRequest } from "../types/ProductRequest";
import axios from "axios";

interface ProductsState {
  products: AdminProductResponse[];
  loading: boolean;

  fetchProducts: (isRefresh?: boolean) => Promise<void>;
  updateProduct: (id: number, updatedData: ProductRequest) => Promise<void>;
  addProduct: (productData: ProductRequest, file: File | null) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
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

  updateProduct: async (id, updatedData) => {
    set({ loading: true });
    try {
      const updatedProduct = await productsRepository.updateProduct(
        id,
        updatedData,
      );

      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
      }));
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (productData, file) => {
    set({ loading: true });
    try {
      let finalImageUrl = productData.imageUrl;

      if (file) {
        const [mainType, subType] = file.type.split("/");

        const { presignedUrl, imageUrl } =
          await productsRepository.getPresignedUrl(mainType, subType);

        const cleanAxios = axios.create();
        await cleanAxios.put(presignedUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        finalImageUrl = imageUrl;
      }

      const newProduct = await productsRepository.createProduct({
        ...productData,
        imageUrl: finalImageUrl,
      });

      set((state) => ({ products: [newProduct, ...state.products] }));
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await productsRepository.deleteProduct(id);

      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));
    } finally {
      set({ loading: false });
    }
  },

  clearProducts: () => set({ products: [] }),
}));
