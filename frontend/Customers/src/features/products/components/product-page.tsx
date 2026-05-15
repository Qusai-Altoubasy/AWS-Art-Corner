import { useEffect, useMemo, useState } from "react";
import { useProductsStore } from "../store/useProductStore";
import { PageHero } from "../../../shared/components/ui/page-hero";
import { LoadingState } from "../../../shared/components/ui/loading-state";
import { EmptyState } from "../../../shared/components/ui/empty-state";
import { Search, Package, RotateCw } from "lucide-react";
import { PageSectionHeader } from "../../../shared/components/ui/page-section-header";
import { ProductCard } from "./product-card";

export const ProductPage = () => {
  const { products, loading, fetchProducts } = useProductsStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  return (
    <main className="flex flex-col gap-8">
      <PageHero
        badge="PREMIUM COLLECTION"
        title="Discover Amazing"
        highlightedTitle="Products"
        description="Browse high quality products."
        statsTitle="Total Products"
        statsValue={filteredProducts.length}
        stateIcon={<Package size={30} />}
      />

      <PageSectionHeader
        title="Product Marketplace"
        description="Explore and add products to your cart."
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
