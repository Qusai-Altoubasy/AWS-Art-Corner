import React, {useEffect, useRef, useState} from "react";
import {CustomerResponseForEmployee} from "../../types/CustomerResponseForEmployee.ts";
import {useOrderStore} from "../../store/useOrderStore.ts";
import {Input} from "../../../../shared/components/ui/input.tsx";
import {toast} from "sonner";

interface Props {
    onSelectCustomer: (customerId: string) => void;
}

export const CustomerSearchDropdown: React.FC<Props> = ({onSelectCustomer}) => {
    const {loading, searchCustomers} = useOrderStore();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<CustomerResponseForEmployee[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const isSearching = loading.customers;
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

        const delayDebounceFn = setTimeout(async () => {
            try {
                const data = await searchCustomers(query);
                setResults(data);
            } catch {
                toast.error("Error fetching customers:");
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [query, searchCustomers]);

    const handleFocus = () => {
        if (results.length > 0) {
            setIsOpen(true);
        }
    };

    const handleSelect = (customer: CustomerResponseForEmployee) => {
        setQuery(customer.customerName);
        onSelectCustomer(customer.customerId);

        setResults([]);
        setIsOpen(false);
    };

    const visibleResults = query.trim().length < 2 ? [] : results;

    return (
        <div ref={dropdownRef} className="relative w-full">
            <Input
                type="text"
                value={query}
                onFocus={handleFocus}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                placeholder="Search by name or phone..."
                className="w-full px-3 py-2 pl-9 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {isOpen && visibleResults.length > 0 && (
                <ul className="absolute z-20 w-full mt-1 bg-neutral-800 border border-white/10 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                    {visibleResults.map((customer) => (
                        <li
                            key={customer.customerId}
                            onClick={() => handleSelect(customer)}
                            className="px-4 py-4 hover:bg-white/5 cursor-pointer flex justify-between items-center text-sm"
                        >
                            <div className="font-semibold text-white">{customer.customerName}</div>
                            <div className="text-xs text-gray-500">{customer.customerPhone}</div>
                        </li>
                    ))}
                </ul>
            )}

            {isOpen && query.trim().length >= 2 && visibleResults.length === 0 && !isSearching && (
                <div
                    className="absolute z-20 w-full mt-1 bg-neutral-800 border border-white/10 rounded-xl p-3 text-xs text-white/40 text-center">
                    There is no match
                </div>
            )}
        </div>
    );
};