import { create } from "zustand";
import { OrderResponseForAdmin } from "../types/OrderResponseForAdmin";
import { OrderStatus } from "../types/OrderStatus";
import { orderRepository } from "../repository/OrderRepositort.ts";

interface OrdersState {
    orders: OrderResponseForAdmin[];
    loading: boolean;

    fetchOrders: (status?: OrderStatus, customerId?: string) => Promise<void>;
    deleteOrder: (orderId: number) => Promise<void>;
    clearOrders: () => void;
}

export const useOrderStore = create<OrdersState>()((set) => ({
    orders: [],
    loading: false,

    fetchOrders: async (status, customerId) => {
        set({ loading: true });
        try {
            const data = await orderRepository.getAllOrders(status, customerId);
            set({ orders: data });
        } finally {
            set({ loading: false });
        }
    },

    deleteOrder: async (orderId) => {
        set({ loading: true });
        try {
            await orderRepository.DeleteOrder(orderId);

            set((state) => ({
                orders: state.orders.filter((order) => order.orderId !== orderId),
            }));
        } finally {
            set({ loading: false });
        }
    },

    clearOrders: () => set({ orders: [] }),
}));