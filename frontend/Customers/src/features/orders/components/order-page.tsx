import { useCallback, useEffect, useMemo, useState } from "react";
import { useOrderStore } from "../store/useOrderStore";
import { OrderStatus } from "../types/OrderResponseForCustomer";
import { PageHero } from "../../../shared/components/ui/page-hero";
import { LoadingState } from "../../../shared/components/ui/loading-state";
import { EmptyState } from "../../../shared/components/ui/empty-state";
import { PageSectionHeader } from "../../../shared/components/ui/page-section-header";
import { OrderCard } from "./order-card";
import { OrderStatusTabs } from "./order-status-tabs";
import { ClipboardList, Search, RotateCw } from "lucide-react";

const DEFAULT_STATUS: OrderStatus = "PENDING";

export const OrderPage = () => {
  const { orders, loading, fetchOrdersByStatus } = useOrderStore();

  const isFetching = loading.fetch;

  const [activeStatus, setActiveStatus] = useState<OrderStatus>(DEFAULT_STATUS);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrdersByStatus(DEFAULT_STATUS);
  }, []);

  const handleStatusChange = useCallback(
    (status: OrderStatus) => {
      setActiveStatus(status);
      setSearch("");
      fetchOrdersByStatus(status);
    },
    [fetchOrdersByStatus],
  );

  const handleRefresh = useCallback(() => {
    fetchOrdersByStatus(activeStatus);
  }, [fetchOrdersByStatus, activeStatus]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      order.orderId.toString().includes(search.toLowerCase()),
    );
  }, [orders, search]);

  return (
    <main className="flex flex-col gap-8">
      <PageHero
        badge="ORDER HISTORY"
        title="Your"
        highlightedTitle="Orders"
        description="Track and manage all your orders in one place. Filter by status and stay updated."
      />

      <OrderStatusTabs
        activeStatus={activeStatus}
        onStatusChange={handleStatusChange}
      />

      <PageSectionHeader
        title="Order List"
        description="Browse and search through your orders."
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by order ID..."
        onRefresh={handleRefresh}
        refreshLoading={isFetching}
        searchIcon={Search}
        refreshIcon={RotateCw}
      />

      {isFetching && <LoadingState count={6} />}

      {!isFetching && filteredOrders.length === 0 && (
        <EmptyState
          title="No orders found"
          description="Looks like you have not placed any orders yet."
          icon={ClipboardList}
        />
      )}

      {!isFetching && filteredOrders.length > 0 && (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredOrders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </section>
      )}
    </main>
  );
};
