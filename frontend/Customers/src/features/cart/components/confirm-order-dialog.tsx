import { ShoppingBag, X } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";

interface ConfirmOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  totalPrice: number;
  itemsCount: number;
}

export const ConfirmOrderDialog = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  totalPrice,
  itemsCount,
}: ConfirmOrderDialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBag size={20} />
            Confirm Order
          </h2>

          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm text-white/80">
          <p>You are about to place an order with:</p>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex justify-between">
              <span>Items</span>
              <span className="font-bold text-white">{itemsCount}</span>
            </div>

            <div className="mt-2 flex justify-between">
              <span>Total Price</span>
              <span className="font-bold text-indigo-400">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <p className="text-xs text-white/50">
            Make sure your cart is correct before confirming.
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            onClick={onClose}
            loading={loading}
            className="w-full bg-white/10 hover:bg-white/20"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            loading={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};
