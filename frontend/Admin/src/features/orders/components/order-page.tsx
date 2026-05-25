import {OrderStatus} from "../types/OrderStatus";
import {useCallback, useEffect, useMemo, useState} from "react";
import {PageHero} from "../../../shared/components/ui/page-hero.tsx";
import {OrderStatusTabs} from "./order-status-tabs.tsx";
import {PageSectionHeader} from "../../../shared/components/ui/page-section-header.tsx";
import {ClipboardList, RotateCw, Search} from "lucide-react";
import {useOrderStore} from "../store/useOrderStore.ts";
import {LoadingState} from "../../../shared/components/ui/loading-state.tsx";
import {EmptyState} from "../../../shared/components/ui/empty-state.tsx";
import {OrderCard} from "./order-card.tsx";
import {toast} from "sonner";

const DEFAULT_STATUS: OrderStatus = "PENDING";

export const OrderPage = () => {
    const {orders, loading, fetchOrdersByStatus} = useOrderStore();

    const [activeStatus, setActiveStatus] = useState<OrderStatus>(DEFAULT_STATUS);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchOrdersByStatus(DEFAULT_STATUS).catch((error) => {
            toast.error(error instanceof Error ? error.message : "Failed to fetch orders");
        });
    }, [fetchOrdersByStatus]);

    const handleStatusChange = useCallback(
        (status: OrderStatus) => {
            setActiveStatus(status);
            setSearch("");
            fetchOrdersByStatus(status).catch((error) => {
                toast.error(error instanceof Error ? error.message : "Failed to fetch orders");
            });
        }, [fetchOrdersByStatus],);

    const handleRefresh = useCallback(() => {
        fetchOrdersByStatus(activeStatus).catch((error) => {
            toast.error(error instanceof Error ? error.message : "Failed to fetch orders");
        });
    }, [fetchOrdersByStatus, activeStatus]);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) =>
            order.orderId.toString().includes(search.toLowerCase()),
        );
    }, [orders, search]);

    return (
        <main className="flex flex-col gap-8">
            <PageHero
                badge="ORDER"
                title="Monitor"
                highlightedTitle="Orders"
                description="Track and manage all orders."
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
                refreshLoading={loading}
                searchIcon={Search}
                refreshIcon={RotateCw}
            />

            {loading && <LoadingState count={6}/>}

            {!loading && filteredOrders.length === 0 && (
                <EmptyState
                    title="No orders found"
                    description="Looks like you don't have any orders."
                    icon={ClipboardList}
                />
            )}

            {!loading && filteredOrders.length > 0 && (
                <section className="grid grid-cols-1 gap-6 sm:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
                    {filteredOrders.map((order) => (
                        <OrderCard key={order.orderId} order={order}/>
                    ))}
                </section>
            )}

        </main>
    );
}