import React, { useEffect, useRef, useState } from "react";
import { ProductResponse } from "../../types/ProductResponse.ts";
import { useOrderStore } from "../../store/useOrderStore.ts";
import { Search } from "lucide-react";
import { Input } from "../../../../shared/components/ui/input.tsx";

interface Props {
    onSelectProduct: (product: ProductResponse) => void;
}

export const ProductSearchDropdown: React.FC<Props> = ({ onSelectProduct }) => {
    const { loading, searchProducts } = useOrderStore();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ProductResponse[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const isSearching = loading.products;
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.trim().length < 2) {
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const data = await searchProducts(query);
                setResults(data);
            } catch {
                console.error("Error fetching products");
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [query, searchProducts]);

    const handleSelect = (product: ProductResponse) => {
        setQuery(product.name);
        onSelectProduct(product);
        setResults([]);
        setIsOpen(false);
    };

    const visibleResults = query.trim().length < 2 ? [] : results;

    return (
        <div ref={dropdownRef} className="relative w-full">
            <div className="relative">
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                    placeholder="Search product by name..."
                    className="w-full px-3 py-2 pl-9 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <Search size={16} className="absolute left-3 top-3 text-white/40" />
            </div>

            {isOpen && visibleResults.length > 0 && (
                <ul className="absolute z-20 w-full mt-1 bg-neutral-800 border border-white/10 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                    {visibleResults.map((product) => (
                        <li
                            key={product.id}
                            onClick={() => handleSelect(product)}
                            className="px-4 py-2 hover:bg-white/5 cursor-pointer flex justify-between items-center text-sm"
                        >
                            <span className="text-white">{product.name}</span>
                            <span className="text-emerald-400 font-semibold">
                                ${product.price.toFixed(2)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            {isOpen && query.trim().length >= 2 && visibleResults.length === 0 && !isSearching && (
                <div className="absolute z-20 w-full mt-1 bg-neutral-800 border border-white/10 rounded-xl p-3 text-xs text-white/40 text-center">
                    No products found
                </div>
            )}
        </div>
    );
};