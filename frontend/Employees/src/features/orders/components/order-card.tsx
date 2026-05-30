import {useCallback} from "react";
import {OrderResponseForEmployee} from "../types/OrderResponseForEmployee.ts";
import {Card, CardContent} from "../../../shared/components/ui/card.tsx";
import {Button} from "../../../shared/components/ui/button.tsx";
import {ArrowRight, CheckCheck, DollarSign, Hash, Package, ShoppingBag, Truck, User,} from "lucide-react";
import {toast} from "sonner";
import {useOrderStore} from "../store/useOrderStore.ts";
import {InfoCard} from "./info-card.tsx";
import {ORDER_STATUS_STYLES} from "../constants/OrderStatusStyle.ts";
import {OrderStatus} from "../types/OrderStatus.ts";

interface OrderCardProps {
    order: OrderResponseForEmployee;
}

export const OrderCard = ({order}: OrderCardProps) => {
    const {updateOrderStatus, loading} = useOrderStore();
    const isUpdating = loading.updateOrder[order.orderId];

    const statusStyle = ORDER_STATUS_STYLES[order.orderStatus];
    const totalItems = order.orderItemResponses.length;

    const handleUpdateStatus = useCallback(async (newStatus: OrderStatus) => {
        if (isUpdating) return;

        try {
            const response = await updateOrderStatus(order.orderId, newStatus);
            toast.success(response);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to update order",
            );
        }
    }, [isUpdating, order.orderId, updateOrderStatus]);

    const getAvailableActions = useCallback((status: OrderStatus) => {
        switch (status) {
            case "PENDING":
                return [
                    {label: "Accept Order", target: "ACCEPTED", icon: ArrowRight},
                ];
            case "ACCEPTED":
                return [
                    {label: "Start Processing", target: "PROCESSING", icon: ArrowRight},
                ];
            case "PROCESSING":
                return [
                    {label: "Mark as Ready", target: "READY", icon: ArrowRight},
                ];
            case "READY":
                return [
                    {label: "Out for Delivery", target: "DELIVERING", icon: Truck},
                    {label: "Complete Directly", target: "COMPLETED", icon: CheckCheck},
                ];
            case "DELIVERING":
                return [
                    {label: "Mark as Completed", target: "COMPLETED", icon: CheckCheck},
                ];
            case "COMPLETED":
                return [];
            default:
                return [];
        }
    }, []);

    const availableActions = getAvailableActions(order.orderStatus);

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
                            <Hash size={16}/>
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
            {statusStyle?.label || order.orderStatus}
          </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/6 bg-white/2 p-3">
                    <User size={16} className="text-white/40 shrink-0"/>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-white/85 truncate">
                            {order.customerName}
                        </p>
                        <p className="text-[11px] text-white/40 truncate">
                            {order.customerEmail}
                        </p>
                        <p className="text-[11px] text-white/40 truncate">
                            {order.customerPhone}
                        </p>
                    </div>
                </div>

                <div className="flex justify-center gap-2">
                    <InfoCard
                        icon={
                            <DollarSign size={14} className="shrink-0 text-indigo-300/70"/>
                        }
                        label="Total"
                        value={`$${order.totalAmount.toFixed(2)}`}
                        valueClassName="font-black"
                        className="flex-1"
                    />

                    <InfoCard
                        icon={
                            <ShoppingBag size={14} className="shrink-0 text-violet-300/70"/>
                        }
                        label="Items"
                        value={totalItems}
                        valueClassName="font-black"
                        className="flex-1"
                    />
                </div>

                <div className="border-t border-white/8"/>

                <div className="flex flex-col gap-2">
                    <p className="text-muted flex items-center gap-1.5 text-xs uppercase tracking-[0.2em]">
                        <Package size={12}/>
                        Products
                    </p>

                    <ul className="flex flex-col gap-1.5">
                        {order.orderItemResponses.map((item) => (
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

                <div className="border-t border-white/8"/>

                {availableActions.length > 0 && (
                    <>
                        <div className="border-t border-white/8"/>
                        <div className="flex flex-wrap gap-3">
                            {availableActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <Button
                                        key={action.target}
                                        onClick={() => handleUpdateStatus(action.target as OrderStatus)}
                                        loading={isUpdating}
                                        className="flex-1"
                                    >
                                        {!loading && <Icon size={16}/>}
                                        {action.label}
                                    </Button>
                                );
                            })}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};