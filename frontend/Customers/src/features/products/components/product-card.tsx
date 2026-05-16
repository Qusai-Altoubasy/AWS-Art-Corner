import { useCartStore } from "../../cart/store/useCartStore";
import { ProductCardBase } from "../../../shared/components/ui/product-card-base";
import { CustomerProductResponse } from "../types/CustomerProductResponse";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: CustomerProductResponse;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { loading, addItem: addToCart } = useCartStore();
  const isAdding = loading.addItem[product.id];

  const [quantity, setQuantity] = useState(50);
  const handleIncrement = () => setQuantity((q) => q + 50);
  const handleDecrement = () => setQuantity((q) => Math.max(50, q - 50));

  const handleAddToCart = useCallback(async () => {
    try {
      const response = await addToCart(product.id, quantity);
      toast.success(response);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add item",
      );
    }
  }, [addToCart, product.id, quantity]);

  return (
    <ProductCardBase
      imageUrl={product.imageUrl}
      title={product.name}
      price={product.price}
      quantity={quantity}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      disableDecrement={quantity <= 50 || isAdding}
      disableIncrement={isAdding}
      actionLabel="Add"
      actionIcon={<ShoppingCart size={18} />}
      onAction={handleAddToCart}
      loading={isAdding}
    />
  );
};
