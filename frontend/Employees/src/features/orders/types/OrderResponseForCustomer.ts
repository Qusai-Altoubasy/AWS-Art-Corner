export interface OrderResponseForCustomer {
  orderId: number;
  customerId: string;
  orderStatus: OrderStatus;
  totalAmount: number;
  createdAt: Date | string;
  orderItemResponses: OrderItemResponse[];
}

export type OrderStatus =
  | "PENDING"
  | "CANCELED"
  | "ACCEPTED"
  | "PROCESSING"
  | "READY"
  | "DELIVERING"
  | "COMPLETED";

export interface OrderItemResponse {
  itemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}
