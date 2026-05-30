import React, {useCallback, useEffect, useState} from 'react';
import {Loader2, PackagePlus, Plus, X} from "lucide-react";
import {CustomerSearchDropdown} from "./customer-search-dropdown.tsx";
import {useOrderStore} from "../../store/useOrderStore.ts";
import {CartItemResponse} from "../../types/CartItemResponse.ts";
import {toast} from "sonner";
import {ProductResponse} from "../../types/ProductResponse.ts";
import {ProductSearchDropdown} from "./product-search-dropdown.tsx";
import {Button} from "../../../../shared/components/ui/button.tsx";
import {Input} from "../../../../shared/components/ui/input.tsx";

interface CreateOrderDialogProps {
    onClose: () => void;
}

export const CreateOrderDialog = ({
                                      onClose,
                                  }: CreateOrderDialogProps) => {
    const {getCartItems, addToCart, loading, placeOrder} = useOrderStore();
    const isCartFetching = loading.fetchingCart;

    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
    const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);

    const [selectedProduct, setSelectedProduct] = useState<ProductResponse>();
    const [quantity, setQuantity] = useState<number>(50);
    const isAdding = loading.addingToCart;
    const isPlacingOrder = loading.placeOrder;

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await getCartItems(selectedCustomerId);
                setCartItems(response);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to fetch cart");
            }
        };

        fetchCart().catch((error) => {
            toast.error(error instanceof Error ? error.message : "Failed to fetch cart");
        });
    }, [getCartItems, selectedCustomerId]);

    const handleAddToCart = useCallback(async () => {
        if (!selectedCustomerId) {
            toast.error("Please select a customer first");
            return;
        }
        if (!selectedProduct) {
            toast.error("Please select a product");
            return;
        }
        try {
            await addToCart(selectedCustomerId, {
                productId: selectedProduct.id,
                quantity: quantity
            });

            const response = await getCartItems(selectedCustomerId);
            setCartItems(response);

            toast.success(`${selectedProduct.name} added successfully`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to add item to cart");
        }
    }, [addToCart, getCartItems, quantity, selectedCustomerId, selectedProduct]);

    const handleConfirmOrder = async () => {
        if (!selectedCustomerId) return;

        try {
            await placeOrder(selectedCustomerId);
            toast.success("Order created successfully!");
            onClose();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to place order");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div
                className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900/90 p-6 text-white shadow-2xl backdrop-blur-md pr-4 custom-scrollbar">

                <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-xl font-bold">
                        <PackagePlus size={20}/>
                        Create Order
                    </h2>

                    <button onClick={onClose} className="text-white/60 hover:text-white">
                        <X size={18}/>
                    </button>
                </div>

                <div className="mt-4 border-t border-white/10 pt-4"/>

                <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl space-y-3">
                    <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Select
                        Customer</label>
                    <CustomerSearchDropdown onSelectCustomer={(customerId) => setSelectedCustomerId(customerId)}/>
                </div>

                {selectedCustomerId && (
                    <div className="mt-4 border-t border-white/10 pt-4"/>
                )}

                {selectedCustomerId && (
                    <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl space-y-3">
                        <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider">Add
                            Products to Cart</label>

                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <ProductSearchDropdown
                                    onSelectProduct={setSelectedProduct}
                                />
                            </div>

                            <div className="w-20">
                                <Input
                                    type="number"
                                    min={50}
                                    step={50}
                                    value={quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 50;
                                        setQuantity(val);
                                    }}
                                />
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                disabled={!selectedProduct || isAdding}
                                title="Add to cart"
                            >
                                {isAdding ? <Loader2 size={16} className="animate-spin"/> : <Plus size={16}/>}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="mt-4 border-t border-white/10 pt-4"/>

                <h3 className="text-sm font-semibold text-white/80 mb-3">Cart Items:</h3>
                {isCartFetching ? (
                    <div className="flex items-center justify-center py-6 gap-2 text-white/60">
                        <Loader2 size={18} className="animate-spin"/>
                        <span>Fetching cart items...</span>
                    </div>
                ) : cartItems.length > 0 ? (
                    <ul className="space-y-2">
                        {cartItems.map((item) => (
                            <li key={item.productId}
                                className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                <div>
                                    <p className="font-medium text-sm">{item.productName}</p>
                                    <p className="text-xs text-white/40">Quantity: {item.quantity}</p>
                                </div>
                                <span className="text-sm font-semibold text-emerald-400">
                                    ${item.price.toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : selectedCustomerId ? (
                    <p className="text-sm text-white/40 text-center py-4">This customer's cart is empty.</p>
                ) : (
                    <p className="text-sm text-white/40 text-center py-4">Please select a customer to view their
                        cart.</p>
                )}

                <div className="mt-4 border-t border-white/10 pt-4"/>

                <div className={"flex justify-center w-full"}>
                    <Button
                        onClick={handleConfirmOrder}
                        loading={isPlacingOrder}
                        disabled={!selectedCustomerId}
                        className="w-full"
                    >
                        Place Order
                    </Button>
                </div>
            </div>
        </div>
    );
};