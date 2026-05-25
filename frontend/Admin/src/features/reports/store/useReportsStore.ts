import {create} from "zustand";
import {reportsRepository} from "../repository/ReportsRepository";
import {SalesReportResponse} from "../types/SalesReportResponse";
import {CustomerOrdersReportResponse} from "../types/CustomerOrdersReportResponse";
import {EmployeePerformanceReportResponse} from "../types/EmployeePerformanceReportResponse";

interface ReportsState {
    salesReport: SalesReportResponse | null;
    customerReport: CustomerOrdersReportResponse | null;
    employeeReport: EmployeePerformanceReportResponse | null;

    loading: {
        sales: boolean;
        customers: boolean;
        employees: boolean;
    };

    fetchSalesReport: (from: string, to: string, isRefresh?: boolean) => Promise<void>;
    fetchCustomerReport: (from: string, to: string, isRefresh?: boolean) => Promise<void>;
    fetchEmployeeReport: (from: string, to: string, isRefresh?: boolean) => Promise<void>;

    clearReports: () => void;
}

export const useReportsStore = create<ReportsState>()((set, get) => ({
    salesReport: null,
    customerReport: null,
    employeeReport: null,

    loading: {
        sales: false,
        customers: false,
        employees: false,
    },

    fetchSalesReport: async (from, to, isRefresh) => {
        if (get().salesReport && !isRefresh) return;

        set((state) => ({loading: {...state.loading, sales: true}}));
        try {
            const data = await reportsRepository.getSalesReport(from, to);
            set({salesReport: data});
        } finally {
            set((state) => ({loading: {...state.loading, sales: false}}));
        }
    },

    fetchCustomerReport: async (from, to, isRefresh) => {
        if (get().customerReport && !isRefresh) return;

        set((state) => ({loading: {...state.loading, customers: true}}));
        try {
            const data = await reportsRepository.getCustomerOrdersReport(from, to);
            set({customerReport: data});
        } finally {
            set((state) => ({loading: {...state.loading, customers: false}}));
        }
    },

    fetchEmployeeReport: async (from, to, isRefresh) => {
        if (get().employeeReport && !isRefresh) return;

        set((state) => ({loading: {...state.loading, employees: true}}));
        try {
            const data = await reportsRepository.getEmployeePerformanceReport(from, to);
            set({employeeReport: data});
        } finally {
            set((state) => ({loading: {...state.loading, employees: false}}));
        }
    },

    clearReports: () => set({
        salesReport: null,
        customerReport: null,
        employeeReport: null
    }),
}));