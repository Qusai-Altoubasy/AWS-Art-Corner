import { useCallback } from "react";
import {
  ORDER_STATUS_STYLES,
  ORDER_STATUSES,
} from "../constants/OrderStatusStyle";
import {OrderStatus} from "../types/OrderStatus.ts";

interface OrderStatusTabsProps {
  activeStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
}

export const OrderStatusTabs = ({
  activeStatus,
  onStatusChange,
}: OrderStatusTabsProps) => {
  const handleClick = useCallback(
    (status: OrderStatus) => {
      if (status !== activeStatus) {
        onStatusChange(status);
      }
    },
    [activeStatus, onStatusChange],
  );

  return (
    <div
      className="
        w-max
        mx-auto
        relative
        overflow-x-auto
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-2
        backdrop-blur-xl
        flex
        justify-center
      "
    >
      <div className="flex min-w-max gap-1 justify-center sm:min-w-0 sm:flex-wrap">
        {ORDER_STATUSES.map((status) => {
          const isActive = status === activeStatus;
          const meta = ORDER_STATUS_STYLES[status];

          return (
            <button
              key={status}
              onClick={() => handleClick(status)}
              className={`
                relative
                flex
                items-center
                gap-2
                rounded-2xl
                px-4
                py-2.5
                text-sm
                font-semibold
                transition-all
                duration-200
                whitespace-nowrap
                ${
                  isActive
                    ? "gradient-primary shadow-primary text-white"
                    : "text-white/60 hover:bg-white/8 hover:text-white"
                }
              `}
            >
              <span
                className={`
                  h-2
                  w-2
                  rounded-full
                  shrink-0
                  transition-all
                  duration-200
                  ${isActive ? "bg-white/80" : meta.dotColor}
                `}
              />
              {meta.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
