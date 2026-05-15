import { ReactNode, useState } from "react";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { Minus, Plus, Check } from "lucide-react";

interface ProductCardBaseProps {
  imageUrl: string;
  title: string;
  price: number;

  quantity: number;

  onIncrement?: () => void;
  onDecrement?: () => void;

  disableIncrement?: boolean;
  disableDecrement?: boolean;

  actionLabel: string;
  actionIcon: ReactNode;
  onAction: () => void;

  loading?: boolean;

  showUpdateButton?: boolean;
  onUpdate?: () => void;
  updating?: boolean;
}

export const ProductCardBase = ({
  imageUrl,
  title,
  price,
  quantity,
  onIncrement,
  onDecrement,
  disableIncrement = false,
  disableDecrement = false,
  actionLabel,
  actionIcon,
  onAction,
  loading = false,

  showUpdateButton = false,
  onUpdate,
  updating = false,
}: ProductCardBaseProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

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
          alt={title}
          onLoad={() => setImageLoaded(true)}
          className="
            h-60
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />
      </div>

      <CardContent className="flex flex-col gap-5">
        <div className="space-y-2">
          <h2 className="line-clamp-1 text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted text-xs uppercase tracking-[0.2em]">
            Quantity
          </p>

          <div
            className="
              flex
              items-center
              gap-2
              rounded-2xl
              border
              border-white/10
              bg-white/5
              px-2
              py-1
            "
          >
            {showUpdateButton && onUpdate && (
              <Button
                loading={updating}
                onClick={onUpdate}
                className="
                bg-indigo-500/20
                text-indigo-200
                hover:bg-indigo-500/30
                "
              >
                <Check size={16} />
              </Button>
            )}
            <button
              onClick={onDecrement}
              disabled={disableDecrement}
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-xl
                text-white/60
                transition-all
                duration-150
                hover:bg-white/10
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <Minus size={14} />
            </button>

            <span className="w-6 text-center text-sm font-bold text-white">
              {quantity}
            </span>

            <button
              onClick={onIncrement}
              disabled={disableIncrement}
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-xl
                text-white/60
                transition-all
                duration-150
                hover:bg-white/10
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted text-xs uppercase tracking-[0.2em]">
              Price
            </p>

            <h3 className="mt-1 text-2xl font-black text-white">
              ${price.toFixed(2)}
            </h3>
          </div>

          <Button onClick={onAction} loading={loading}>
            {actionIcon}
            {actionLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
