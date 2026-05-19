import {
  AlertTriangle,
  DollarSign,
  Package,
  ShoppingBag,
  Tag,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";
import { Input } from "../../../shared/components/ui/input";
import { Button } from "../../../shared/components/ui/button";
import { ProductRequest } from "../types/ProductRequest";

interface AddDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: ProductRequest, file: File | null) => void;
  loading: boolean;
}

export const AddDialog = ({
  open,
  onClose,
  onConfirm,
  loading,
}: AddDialogProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [cost, setCost] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [stockThreshold, setStockThreshold] = useState<number | "">("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSave = () => {
    if (
      !name ||
      price === "" ||
      cost === "" ||
      stock === "" ||
      stockThreshold === ""
    )
      return;

    onConfirm(
      {
        name,
        price: Number(price),
        cost: Number(cost),
        stock: Number(stock),
        stockThreshold: Number(stockThreshold),
        imageUrl: "",
      },
      selectedFile,
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/90 p-6 text-white shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBag size={20} className="text-emerald-400" />
            Add New Product
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 max-h-[60vh] overflow-y-auto pr-1 space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <Input
            label="Product Name"
            placeholder="Enter product name"
            icon={<Tag size={16} />}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              placeholder="0.00"
              icon={<DollarSign size={16} />}
              value={price}
              onChange={(e) =>
                setPrice(e.target.value === "" ? "" : Number(e.target.value))
              }
              disabled={loading}
            />
            <Input
              label="Cost"
              type="number"
              placeholder="0.00"
              icon={<DollarSign size={16} />}
              value={cost}
              onChange={(e) =>
                setCost(e.target.value === "" ? "" : Number(e.target.value))
              }
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Stock Quantity"
              type="number"
              placeholder="0"
              icon={<Package size={16} />}
              value={stock}
              onChange={(e) =>
                setStock(e.target.value === "" ? "" : Number(e.target.value))
              }
              disabled={loading}
            />
            <Input
              label="Stock Threshold"
              type="number"
              placeholder="0"
              icon={<AlertTriangle size={16} />}
              value={stockThreshold}
              onChange={(e) =>
                setStockThreshold(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-white/60">
              Product Image
            </label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 p-4 text-sm hover:bg-white/10 transition-colors">
              <ImageIcon size={18} className="text-white/60" />
              <span className="truncate">
                {selectedFile ? selectedFile.name : "Choose image..."}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={loading}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
          <Button onClick={onClose} loading={loading} className="w-full">
            Cancel
          </Button>
          <Button onClick={handleSave} loading={loading} className="w-full">
            Create Product
          </Button>
        </div>
      </div>
    </div>
  );
};
