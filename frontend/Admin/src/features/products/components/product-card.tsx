import { ProductCardBase } from "../../../shared/components/ui/product-card-base";
import { useProductsStore } from "../store/useProductStore";
import { AdminProductResponse } from "../types/AdminProductResponse";
import { useState } from "react";
import { EditDialog } from "./edit-dialog";
import { ProductRequest } from "../types/ProductRequest";
import { toast } from "sonner";

interface ProductCardProps {
  product: AdminProductResponse;
  onEdit?: (id: number) => void;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { loading, updateProduct, deleteProduct } = useProductsStore();

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmUpdate = async (updatedData: ProductRequest) => {
    try {
      await updateProduct(product.id, updatedData);

      setIsDialogOpen(false);
      toast.success("Product update successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id);
      toast.success("Product has been deleted.");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <ProductCardBase
        name={product.name}
        price={product.price}
        cost={product.cost}
        stock={product.stock}
        stockThreshold={product.stockThreshold}
        imageUrl={product.imageUrl}
        onEdit={handleEditClick}
        isUpdating={loading}
      />

      <EditDialog
        name={product.name}
        price={product.price}
        cost={product.cost}
        stock={product.stock}
        stockThreshold={product.stockThreshold}
        open={isDialogOpen}
        loading={loading}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmUpdate}
        onDelete={handleDelete}
      />
    </>
  );
};
