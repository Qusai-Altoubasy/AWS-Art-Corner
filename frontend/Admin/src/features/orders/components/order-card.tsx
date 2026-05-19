import { useCallback } from "react";
import { OrderResponseForAdmin } from "../types/OrderResponseForAdmin";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import {
  Hash,
  Calendar,
  DollarSign,
  ShoppingBag,
  Package,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useOrderStore } from "../store/useOrderStore";
import { InfoCard } from "./info-card";
import { formatDate } from "../../../app/utils/format-date";
import { ORDER_STATUS_STYLES } from "../constants/OrderStatusStyle";

interface OrderCardProps {
  order: OrderResponseForAdmin;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const { deleteOrder, loading } = useOrderStore();

  const statusStyle = ORDER_STATUS_STYLES[order.status];
  const totalItems = order.items.length;

  const handleDelete = useCallback(async () => {
    try {
      await deleteOrder(order.orderId);
      toast.success("Order deleted successfully");
    } catch (error) {
      toast.error(
          error instanceof Error ? error.message : "Failed to delete order",
      );
    }
  }, [deleteOrder, order.orderId]);

  return (
      <Card
          className="
        group
        overflow-hidden
        border-white/10
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-indigo-500/30
        hover:shadow-[0_20px_60px_rgba(99,102,241,0.2)]
        fade-in
      "
      >
        <CardContent className="flex flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                  className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-indigo-500/15
                text-indigo-300
              "
              >
                <Hash size={16} />
              </div>

              <div>
                <p className="text-muted text-xs uppercase tracking-[0.2em]">
                  Order ID
                </p>
                <h3 className="text-lg font-bold text-white">#{order.orderId}</h3>
              </div>
            </div>

            <span
                className={`
              shrink-0
              rounded-xl
              border
              px-3
              py-1
              text-xs
              font-semibold
              tracking-wide
              uppercase
              ${statusStyle?.bg || "bg-white/5"}
              ${statusStyle?.text || "text-white"}
              ${statusStyle?.border || "border-white/10"}
            `}
            >
            {statusStyle?.label || order.status}
          </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/6 bg-white/2 p-3">
            <User size={16} className="text-white/40 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white/85 truncate">
                {order.customerName}
              </p>
              <p className="text-[11px] text-white/40 truncate">
                {order.customerEmail}
              </p>
            </div>
          </div>

          {order.employeeId && order.employeeName && order.employeeEmail && (
              <div className="flex items-center gap-2 rounded-xl border border-white/6 bg-white/2 p-3">
                <User size={16} className="text-white/40 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white/85 truncate">
                    {order.employeeName}
                  </p>
                  <p className="text-[11px] text-white/40 truncate">
                    {order.employeeEmail}
                  </p>
                </div>
              </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <InfoCard
                className="col-span-3 sm:col-span-1"
                icon={<Calendar size={14} className="shrink-0 text-white/40" />}
                label="Date"
                value={formatDate(order.createdAt)}
                valueClassName="text-xs font-semibold"
            />

            <InfoCard
                icon={
                  <DollarSign size={14} className="shrink-0 text-indigo-300/70" />
                }
                label="Total"
                value={`$${order.totalAmount.toFixed(2)}`}
                valueClassName="font-black"
            />

            <InfoCard
                icon={
                  <ShoppingBag size={14} className="shrink-0 text-violet-300/70" />
                }
                label="Items"
                value={totalItems}
                valueClassName="font-black"
            />
          </div>

          <div className="border-t border-white/8" />

          <div className="flex flex-col gap-2">
            <p className="text-muted flex items-center gap-1.5 text-xs uppercase tracking-[0.2em]">
              <Package size={12} />
              Products
            </p>

            <ul className="flex flex-col gap-1.5">
              {order.items.map((item) => (
                  <li
                      key={item.productId}
                      className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  rounded-xl
                  border
                  border-white/6
                  bg-white/4
                  px-3
                  py-2
                  transition-colors
                  duration-150
                  hover:border-white/10
                  hover:bg-white/6
                "
                  >
                    <div className="flex min-w-0 items-center gap-2">
                  <span
                      className="
                      flex
                      h-6
                      w-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-indigo-500/20
                      text-[11px]
                      font-bold
                      text-indigo-300
                    "
                  >
                    {item.quantity}
                  </span>

                      <span className="truncate text-sm font-medium text-white/85">
                    {item.productName}
                  </span>
                    </div>

                    <span className="shrink-0 text-sm font-bold text-white">
                  ${item.price.toFixed(2)}
                </span>
                  </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-white/8" />

          <Button
              onClick={handleDelete}
              loading={loading}
              className="
            w-full
            bg-red-500/15
            text-red-300
            shadow-none
            hover:bg-red-500/25
            hover:translate-y-0
            border
            border-red-500/20
          "
          >
            {!loading && <Trash2 size={16} />}
            Delete Order
          </Button>
        </CardContent>
      </Card>
  );
};