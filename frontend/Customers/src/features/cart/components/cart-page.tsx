import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { PageHero } from "../../../shared/components/ui/page-hero";
import { LoadingState } from "../../../shared/components/ui/loading-state";
import { EmptyState } from "../../../shared/components/ui/empty-state";
import { Search, ShoppingCart, RotateCw, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { ConfirmOrderDialog } from "./confirm-order-dialog";
import { PageSectionHeader } from "../../../shared/components/ui/page-section-header";
import { CartCard } from "./cart-card";

export const CartPage = () => {
  const { cart, loading, fetchCart, placeOrder } = useCartStore();
  const isFetching = loading.fetch;
  const isPlacingOrder = loading.placeOrder;
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const filteredCart = useMemo(() => {
    return cart.filter((item) =>
      item.productName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [cart, search]);

  const totalPrice = useMemo(() => {
    return filteredCart.reduce((total, item) => total + item.price, 0);
  }, [filteredCart]);

  const handlePlaceOrder = async () => {
    try {
      await placeOrder();
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to place order",
      );
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  return (
    <main className="flex flex-col gap-8">
      <PageHero
        badge="SHOPPING CART"
        title="Your Shopping"
        highlightedTitle="Cart"
        description="Review your selected products, manage quantities, and prepare for checkout."
        statsTitle="Total Amount"
        statsValue={`$${totalPrice.toFixed(2)}`}
        stateIcon={<ShoppingCart size={30} />}
        buttonAction={() => setConfirmDialogOpen(true)}
        buttonIcon={<ShoppingBag />}
        buttonLoading={isPlacingOrder}
        buttonLabel="Place Order"
      />

      <ConfirmOrderDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handlePlaceOrder}
        loading={isPlacingOrder}
        totalPrice={totalPrice}
        itemsCount={filteredCart.length}
      />

      <PageSectionHeader
        title="Cart Items"
        description="Manage your products before checkout."
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search cart items..."
        onRefresh={() => fetchCart(true)}
        refreshLoading={isFetching}
        searchIcon={Search}
        refreshIcon={RotateCw}
      />

      {isFetching && <LoadingState count={4} />}

      {!isFetching && filteredCart.length === 0 && (
        <EmptyState
          title="Your Cart is Empty"
          description="Looks like you have not added any products yet."
          icon={ShoppingCart}
        />
      )}

      {!isFetching && filteredCart.length > 0 && (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredCart.map((item) => (
            <CartCard key={item.productId} item={item} />
          ))}
        </section>
      )}
    </main>
  );
};
