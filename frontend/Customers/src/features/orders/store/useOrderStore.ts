import { create } from "zustand";
import {
  OrderResponseForCustomer,
  OrderStatus,
} from "../types/OrderResponseForCustomer";
import { orderRepository } from "../repository/OrderRepository";

interface OrderState {
  orders: OrderResponseForCustomer[];

  loading: {
    fetch: boolean;
    placeOrder: boolean;
    cancelOrder: Record<number, boolean>;
  };

  fetchOrdersByStatus: (status: OrderStatus) => Promise<void>;
  placeOrder: () => Promise<OrderResponseForCustomer>;
  cancelOrder: (orderId: number) => Promise<string>;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>()((set) => ({
  orders: [],

  loading: {
    fetch: false,
    placeOrder: false,
    cancelOrder: {},
  },

  fetchOrdersByStatus: async (status: OrderStatus) => {
    set((state) => ({
      loading: { ...state.loading, fetch: true },
    }));

    try {
      const data = await orderRepository.getOrdersBystatus(status);
      set({ orders: data });
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
      const newOrder = await orderRepository.placeOrder();
      set((state) => ({
        orders: [newOrder, ...state.orders],
      }));
      return newOrder;
    } finally {
      set((state) => ({
        loading: { ...state.loading, placeOrder: false },
      }));
    }
  },

  cancelOrder: async (orderId: number) => {
    set((state) => ({
      loading: {
        ...state.loading,
        cancelOrder: { ...state.loading.cancelOrder, [orderId]: true },
      },
    }));

    try {
      const response = await orderRepository.cancelOrder(orderId);

      set((state) => ({
        orders: state.orders.filter((o) => o.orderId !== orderId),
      }));

      return response;
    } finally {
      set((state) => ({
        loading: {
          ...state.loading,
          cancelOrder: { ...state.loading.cancelOrder, [orderId]: false },
        },
      }));
    }
  },

  clearOrders: () => set({ orders: [] }),
}));
