import { api } from "../../../app/config/api-config";
import { OrderResponseForEmployee } from "../types/OrderResponseForEmployee.ts";
import { OrderStatus } from "../types/OrderStatus";
import { CustomerResponseForEmployee } from "../types/CustomerResponseForEmployee.ts";
import { ProductResponse } from "../types/ProductResponse.ts";
import { CartItemRequest } from "../types/CartItemRequest.ts";
import { CartItemResponse } from "../types/CartItemResponse.ts";
import { OrderResponseForCustomer } from "../types/OrderResponseForCustomer.ts";

class OrderRepository {

    async getOrdersByStatus(status?: OrderStatus): Promise<OrderResponseForEmployee[]> {
        const response = await api.get<OrderResponseForEmployee[]>("/api/orders/employee", {
            params: { status },
        });
        return response.data;
    }

    async updateOrderStatus(orderId: number, status: OrderStatus): Promise<string> {
        const response = await api.patch<string>(`/api/orders/employee/${orderId}/status`, null, {
            params: { status }
        });
        return response.data;
    }

    async searchCustomers(query: string): Promise<CustomerResponseForEmployee[]> {
        const response = await api.get<CustomerResponseForEmployee[]>("/api/users/search/CUSTOMER", {
            params: { query }
        });
        return response.data;
    }

    async searchProducts(query: string): Promise<ProductResponse[]> {
        const response = await api.get<ProductResponse[]>("/api/inventory/search", {
            params: { query }
        });
        return response.data;
    }

    async getCartItems(customerId?: string): Promise<CartItemResponse[]> {
        const response = await api.get<CartItemResponse[]>("/api/cart/items", {
            params: { customerId }
        });
        return response.data;
    }

    async addToCart(customerId: string, item: CartItemRequest): Promise<string> {
        const response = await api.post<string>("/api/cart/item", item, {
            params: { customerId }
        });
        return response.data;
    }

    async removeFromCart(customerId: string, productId: number): Promise<void> {
        await api.delete<void>(`/api/cart/item/${productId.toString()}`, {
            params: { customerId }
        });
    }

    async placeOrder(customerId?: string): Promise<OrderResponseForCustomer> {
        const response = await api.post<OrderResponseForCustomer>("/api/orders", {}, {
            params: { customerId }
        });
        return response.data;
    }
}

export const orderRepository = new OrderRepository();