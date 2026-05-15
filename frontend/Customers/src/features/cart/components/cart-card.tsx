import { CartItemResponse } from "../types/CartItemResponse";
import { ProductCardBase } from "../../../shared/components/ui/product-card-base";
import { Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "../store/useCartStore";

interface CartCardProps {
  item: CartItemResponse;
}

export const CartCard = ({ item }: CartCardProps) => {
  const { removeItem, addItem: addToCart, loading } = useCartStore();

  const isRemoving = loading.removeItem[item.productId];
  const isUpdating = loading.addItem[item.productId];

  const [quantity, setQuantity] = useState(item.quantity);

  const handleRemove = useCallback(async () => {
    try {
      await removeItem(item.productId);
      toast.success(`${item.productName} removed`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove item",
      );
    }
  }, [removeItem, item.productId, item.productName]);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleUpdate = useCallback(async () => {
    try {
      const response = await addToCart(
        item.productId,
        quantity - item.quantity,
      );
      toast.success(response);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update item",
      );
    }
  }, [addToCart, item.productId, quantity]);

  const hasChanges = quantity !== item.quantity;
  return (
    <ProductCardBase
      imageUrl={item.imageUrl}
      title={item.productName}
      price={item.price}
      quantity={quantity}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      disableDecrement={quantity <= 1 || isRemoving}
      disableIncrement={isRemoving}
      actionLabel="Remove"
      actionIcon={<Trash2 size={18} />}
      onAction={handleRemove}
      loading={isRemoving}
      showUpdateButton={hasChanges}
      onUpdate={handleUpdate}
      updating={isUpdating}
    />
  );
};
