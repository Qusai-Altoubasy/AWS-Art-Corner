import {
  AlertTriangle,
  DollarSign,
  Package,
  ShoppingBag,
  Tag,
  X,
} from "lucide-react";
import { Input } from "../../../shared/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "../../../shared/components/ui/button";
import { ProductRequest } from "../types/ProductRequest";

interface EditDialogProps {
  name: string;
  price: number;
  cost: number;
  stock: number;
  stockThreshold: number;
  open: boolean;
  onClose: () => void;
  onConfirm: (updatedData: ProductRequest) => void;
  onDelete: () => void;
  loading: boolean;
}

export const EditDialog = ({
  name,
  price,
  cost,
  stock,
  stockThreshold,
  open,
  onClose,
  onConfirm,
  onDelete,
  loading,
}: EditDialogProps) => {
  if (!open) return null;

  const [editedName, setEditedName] = useState(name);
  const [editedPrice, setEditedPrice] = useState(price);
  const [editedCost, setEditedCost] = useState(cost);
  const [editedStock, setEditedStock] = useState(stock);
  const [editedStockThreshold, setEditedStockThreshold] =
    useState(stockThreshold);

  useEffect(() => {
    if (open) {
      setEditedName(name);
      setEditedPrice(price);
      setEditedCost(cost);
      setEditedStock(stock);
      setEditedStockThreshold(stockThreshold);
    }
  }, [open, name, price, cost, stock, stockThreshold]);

  const handleSave = () => {
    const newData: ProductRequest = {
      name: editedName,
      price: Number(editedPrice),
      cost: Number(editedCost),
      stock: Number(editedStock),
      stockThreshold: Number(editedStockThreshold),
      imageUrl: "",
    };

    onConfirm(newData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/90 p-6 text-white shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBag size={20} />
            Edit Product
          </h2>

          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm text-white/80">
          <p>You are about to edit product : {name}</p>
        </div>

        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1 space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <Input
            label="Product Name"
            placeholder="Enter product name"
            icon={<Tag size={16} />}
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            disabled={loading}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              placeholder="0.00"
              icon={<DollarSign size={16} />}
              value={editedPrice}
              onChange={(e) => setEditedPrice(Number(e.target.value))}
              disabled={loading}
            />

            <Input
              label="Cost"
              type="number"
              placeholder="0.00"
              icon={<DollarSign size={16} />}
              value={editedCost}
              onChange={(e) => setEditedCost(Number(e.target.value))}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Stock Qty"
              type="number"
              placeholder={stock.toString()}
              icon={<Package size={16} />}
              value={editedStock}
              onChange={(e) => setEditedStock(Number(e.target.value))}
              disabled={loading}
            />

            <Input
              label="Stock Threshold"
              type="number"
              placeholder={stockThreshold.toString()}
              icon={<AlertTriangle size={16} />}
              value={editedStockThreshold}
              onChange={(e) => setEditedStockThreshold(Number(e.target.value))}
              disabled={loading}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
          <Button onClick={onClose} loading={loading} className="w-full">
            Cancel
          </Button>
          <Button onClick={handleSave} loading={loading} className="w-full">
            Save
          </Button>
          <Button onClick={onDelete} loading={loading} className="w-full">
            Delete Product
          </Button>
        </div>
      </div>
    </div>
  );
};
