import { useState } from "react";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { AlertTriangle, Package, DollarSign, Edit } from "lucide-react";

interface ProductCardBaseProps {
  name: string;
  price: number;
  cost: number;
  stock: number;
  stockThreshold: number;
  imageUrl: string;

  onEdit: () => void;
  isUpdating?: boolean;
}

export const ProductCardBase = ({
  name,
  price,
  cost,
  stock,
  stockThreshold,
  imageUrl,
  onEdit,
  isUpdating = false,
}: ProductCardBaseProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const isLowStock = stock <= stockThreshold;

  return (
    <Card
      className="
        group
        overflow-hidden
        border-white/10
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-indigo-500/30
        hover:shadow-[0_20px_60px_rgba(99,102,241,0.25)]
      "
    >
      <div className="relative overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-white/5" />
        )}

        <img
          src={imageUrl}
          alt={name}
          onLoad={() => setImageLoaded(true)}
          className="
            h-56
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />
      </div>

      {isLowStock && (
        <div
          className="
        absolute
        right-3
        top-3
        flex
        items-center
        gap-1.5
        rounded-xl
        bg-red-500/80
        px-3
        py-1.5
        text-xs
        font-bold
        text-white
        backdrop-blur-md
        shadow-lg
        border
        border-red-500/20
        animate-pulse
        "
        >
          <AlertTriangle size={14} />
          <span>Low Stock</span>
        </div>
      )}

      <CardContent className="flex flex-col gap-5">
        <div className="space-y-2">
          <h2 className="line-clamp-1 text-xl font-bold text-white">{name}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm">
          <div className="space-y-0.5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40 flex items-center gap-1">
              <DollarSign size={12} /> Selling Price
            </p>
            <p className="text-base font-black text-white">
              ${price.toFixed(2)}
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
              Cost Price
            </p>
            <p className="text-base font-bold text-white/70">
              ${cost.toFixed(2)}
            </p>
          </div>

          <div className="col-span-2 mt-1 flex items-center justify-between border-t border-white/5 pt-3">
            <div className="space-y-0.5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                Stock Count
              </p>
              <div
                className={`flex items-center gap-1 text-sm font-bold ${isLowStock ? "text-red-400" : "text-emerald-400"}`}
              >
                <Package size={14} />
                <span>{stock} Units</span>
                <span className="text-[11px] font-normal text-white/40">
                  ( Stock threshold : {stockThreshold} )
                </span>
              </div>
            </div>
          </div>
        </div>

        <Button onClick={onEdit} loading={isUpdating}>
          <Edit size={16} />
          <span>Edit Product</span>
        </Button>
      </CardContent>
    </Card>
  );
};
