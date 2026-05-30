import {create} from "zustand";
import {OrderResponseForEmployee} from "../types/OrderResponseForEmployee.ts";
import {OrderStatus} from "../types/OrderStatus";
import {orderRepository} from "../repository/OrderRepository.ts";
import {CustomerResponseForEmployee} from "../types/CustomerResponseForEmployee.ts";
import {ProductResponse} from "../types/ProductResponse.ts";
import {OrderResponseForCustomer} from "../types/OrderResponseForCustomer.ts";
import {CartItemRequest} from "../types/CartItemRequest.ts";
import {CartItemResponse} from "../types/CartItemResponse.ts";

interface OrdersState {
    orders: OrderResponseForEmployee[];

    loading: {
        orders: boolean;
        customers: boolean;
        products: boolean;
        fetchingCart: boolean;
        addingToCart: boolean;
        removingFromCart: boolean;
        placeOrder: boolean;
        updateOrder: Record<number, boolean>;
    };

    fetchOrdersByStatus: (status: OrderStatus) => Promise<void>;
    updateOrderStatus: (orderId: number, status: OrderStatus) => Promise<string>;
    clearOrders: () => void;

    searchCustomers: (query: string) => Promise<CustomerResponseForEmployee[]>;
    searchProducts: (query: string) => Promise<ProductResponse[]>;

    getCartItems: (customerId: string) => Promise<CartItemResponse[]>;
    addToCart: (customerId: string, item: CartItemRequest) => Promise<string>;
    removeFromCart: (customerId: string, productId: number) => Promise<void>;

    placeOrder: (customerId: string) => Promise<OrderResponseForCustomer>;
}

export const useOrderStore = create<OrdersState>()((set) => ({
    orders: [],
    loading: {
        orders: false,
        customers: false,
        products: false,
        fetchingCart: false,
        addingToCart: false,
        removingFromCart: false,
        placeOrder: false,
        updateOrder: {},
    },

    fetchOrdersByStatus: async (status) => {
        set((state) => ({
            loading: {...state.loading, orders: true},
        }));

        try {
            const data = await orderRepository.getOrdersByStatus(status);
            set({orders: data});
        } finally {
            set((state) => ({
                loading: {...state.loading, orders: false},
            }));
        }
    },

    updateOrderStatus: async (orderId, status) => {
        set((state) => ({
            loading: {
                ...state.loading,
                updateOrder: {...state.loading.updateOrder, [orderId]: true},
            },
        }));

        try {
            const response = await orderRepository.updateOrderStatus(orderId, status);

            set((state) => ({
                orders: state.orders.filter((order) => order.orderId !== orderId),
            }));

            return response;
        } finally {
            set((state) => ({
                loading: {
                    ...state.loading,
                    updateOrder: {
                        ...state.loading.updateOrder,
                        [orderId]: false,
                    },
                },
            }));
        }
    },

    clearOrders: () => set({orders: []}),

    searchCustomers: async (query) => {
        if (query.trim().length < 2) return [];

        set((state) => ({
            loading: {...state.loading, customers: true},
        }));

        try {
            return await orderRepository.searchCustomers(query);
        } finally {
            set((state) => ({
                loading: {...state.loading, customers: false},
            }));
        }
    },

    searchProducts: async (query) => {
        if (query.trim().length < 2) return [];

        set((state) => ({
            loading: {...state.loading, products: true},
        }));

        try {
            return await orderRepository.searchProducts(query);
        } finally {
            set((state) => ({
                loading: {...state.loading, products: false},
            }));
        }
    },

    getCartItems: async (customerId) => {
        set((state) => ({
            loading: {...state.loading, fetchingCart: true},
        }));

        try {
            return await orderRepository.getCartItems(customerId);
        } finally {
            set((state) => ({
                loading: {...state.loading, fetchingCart: false},
            }));
        }
    },

    addToCart: async (customerId, item) => {
        set((state) => ({
            loading: {...state.loading, addingToCart: true},
        }));

        try {
            return await orderRepository.addToCart(customerId, item);
        } finally {
            set((state) => ({
                loading: {...state.loading, addingToCart: false},
            }))
        }
    },

    removeFromCart: async (customerId, productId) => {
        set((state) => ({
            loading: {...state.loading, removingFromCart: true},
        }));
        try {
            await orderRepository.removeFromCart(customerId, productId);
        } finally {
            set((state) => ({
                loading: {...state.loading, removingFromCart: false},
            }))
        }
    },

    placeOrder: async (customerId) => {
        set((state) => ({
            loading: {...state.loading, placeOrder: true},
        }));

        try {
            return await orderRepository.placeOrder(customerId);
        } finally {
            set((state) => ({
                loading: {...state.loading, placeOrder: false},
            }));
        }
    },
}));