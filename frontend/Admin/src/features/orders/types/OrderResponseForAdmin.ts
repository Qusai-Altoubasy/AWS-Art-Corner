import { OrderStatus } from "./OrderStatus";

export interface OrderResponseForAdmin {
  orderId: number;
  status: OrderStatus;

  customerId: string;
  customerName: string;
  customerEmail: string;

  employeeId?: string;
  employeeName?: string;
  employeeEmail?: string;

  totalAmount: number;
  totalCost: number;

  createdAt: string;
  updatedAt: string;

  items: OrderItemForAdmin[];
}

export interface OrderItemForAdmin {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  cost: number;
}
