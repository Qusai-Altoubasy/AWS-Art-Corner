import { useEffect, useMemo, useState } from "react";
import { useProductsStore } from "../store/useProductStore";
import { PageHero } from "../../../shared/components/ui/page-hero";
import { LoadingState } from "../../../shared/components/ui/loading-state";
import { EmptyState } from "../../../shared/components/ui/empty-state";
import { Search, Package, RotateCw, Plus } from "lucide-react";
import { PageSectionHeader } from "../../../shared/components/ui/page-section-header";
import { ProductCard } from "./product-card";
import { toast } from "sonner";
import { ProductRequest } from "../types/ProductRequest";
import { AddDialog } from "./add-dialog";

export const ProductPage = () => {
  const { products, loading, fetchProducts, addProduct } = useProductsStore();
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  const handleConfirmAdd = async (data: ProductRequest, file: File | null) => {
    try {
      await addProduct(data, file);
      setIsAddDialogOpen(false);
      toast.success("Product created successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred while adding the product");
      }
    }
  };

  return (
    <main className="flex flex-col gap-8">
      <PageHero
        badge="INVENTORY MANAGEMENT"
        title="Manage Your"
        highlightedTitle="Products"
        description="Monitor stock levels, costs, and more"
        statsTitle="Total Products"
        statsValue={filteredProducts.length}
        stateIcon={<Package size={30} />}
        buttonAction={() => setIsAddDialogOpen(true)}
        buttonLabel="Add Product"
        buttonIcon={<Plus size={16} />}
        buttonLoading={loading}
      />

      <AddDialog
          key={isAddDialogOpen ? "open" : "closed"}
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onConfirm={handleConfirmAdd}
          loading={loading}
      />

      <PageSectionHeader
        title="Products List"
        description="View and edit all products in wharehose."
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search products..."
        onRefresh={() => fetchProducts(true)}
        refreshLoading={loading}
        searchIcon={Search}
        refreshIcon={RotateCw}
      />

      {loading && <LoadingState />}

      {!loading && filteredProducts.length === 0 && (
        <EmptyState title="No Products Found" icon={Package} />
      )}

      {!loading && filteredProducts.length > 0 && (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
};
