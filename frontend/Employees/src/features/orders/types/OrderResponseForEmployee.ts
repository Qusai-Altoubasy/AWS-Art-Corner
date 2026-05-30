import { OrderStatus } from "./OrderStatus";

export interface OrderResponseForEmployee {
  orderId: number;
  orderStatus: OrderStatus;
  totalAmount: number;

  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  orderItemResponses: OrderItemResponse[];
}

export interface OrderItemResponse {
  itemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}
