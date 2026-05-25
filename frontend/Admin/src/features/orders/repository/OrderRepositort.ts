import { api } from "../../../app/config/api-config";
import { OrderResponseForAdmin } from "../types/OrderResponseForAdmin";
import { OrderStatus } from "../types/OrderStatus";

class OrderRepository {
  async getAllOrders(
    status?: OrderStatus,
    customerId?: string,
  ): Promise<OrderResponseForAdmin[]> {
    const response = await api.get<OrderResponseForAdmin[]>("/api/orders/admin", {
      params: {
        status,
        customerId,
      },
    });
    return response.data;
  }

  async DeleteOrder(orderId: number) {
    await api.delete<void>(`/api/orders/${orderId}/delete`);
  }
}

export const orderRepository = new OrderRepository();
