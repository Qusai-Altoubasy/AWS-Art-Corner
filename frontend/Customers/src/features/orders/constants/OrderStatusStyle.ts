import { OrderStatus } from "../types/OrderResponseForCustomer";

export interface OrderStatusStyle {
  label: string;

  bg: string;
  text: string;
  border: string;

  dotColor: string;
}

export const ORDER_STATUS_STYLES: Record<OrderStatus, OrderStatusStyle> = {
  PENDING: {
    label: "Pending",

    bg: "bg-amber-500/10",
    text: "text-amber-300",
    border: "border-amber-500/20",

    dotColor: "bg-amber-400",
  },

  ACCEPTED: {
    label: "Accepted",

    bg: "bg-blue-500/10",
    text: "text-blue-300",
    border: "border-blue-500/20",

    dotColor: "bg-blue-400",
  },

  PROCESSING: {
    label: "Processing",

    bg: "bg-indigo-500/10",
    text: "text-indigo-300",
    border: "border-indigo-500/20",

    dotColor: "bg-indigo-400",
  },

  READY: {
    label: "Ready",

    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
    border: "border-emerald-500/20",

    dotColor: "bg-emerald-400",
  },

  DELIVERING: {
    label: "Delivering",

    bg: "bg-purple-500/10",
    text: "text-purple-300",
    border: "border-purple-500/20",

    dotColor: "bg-purple-400",
  },

  COMPLETED: {
    label: "Completed",

    bg: "bg-green-500/10",
    text: "text-green-300",
    border: "border-green-500/20",

    dotColor: "bg-green-400",
  },

  CANCELED: {
    label: "Canceled",

    bg: "bg-red-500/10",
    text: "text-red-300",
    border: "border-red-500/20",

    dotColor: "bg-red-400",
  },
};

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "ACCEPTED",
  "PROCESSING",
  "READY",
  "DELIVERING",
  "COMPLETED",
  "CANCELED",
];
