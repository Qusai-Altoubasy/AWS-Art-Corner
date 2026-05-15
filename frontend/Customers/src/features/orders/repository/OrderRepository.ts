import { api } from "../../../app/config/api-config";
import { OrderResponseForCustomer } from "../types/OrderResponseForCustomer";
import { OrderStatus } from "../types/OrderResponseForCustomer";

class OrderRepository {
  async placeOrder(): Promise<OrderResponseForCustomer> {
    const response = await api.post("/api/orders");
    return response.data;
  }

  async getOrdersBystatus(
    status: OrderStatus,
  ): Promise<OrderResponseForCustomer[]> {
    const response = await api.get("/api/orders/customer", {
      params: { status },
    });
    return response.data;
  }

  async cancelOrder(orderId: number): Promise<string> {
    const response = await api.patch(`/api/orders/customer/${orderId}/cancel`);
    return response.data;
  }
}

export const orderRepository = new OrderRepository();
