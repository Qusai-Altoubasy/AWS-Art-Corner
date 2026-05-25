import { ReportsTypes } from "../types/ReportsTypes";

export interface ReportTypesStyle {
    label: string;
    icon: string;
    bg: string;
    text: string;
    border: string;
    dotColor: string;
}

export const REPORT_TYPES_STYLES: Record<ReportsTypes, ReportTypesStyle> = {
    SALES: {
        label: "Sales Report",
        icon: "TrendingUp",
        bg: "bg-amber-500/10",
        text: "text-amber-300",
        border: "border-amber-500/20",
        dotColor: "bg-amber-400",
    },

    CUSTOMERS: {
        label: "Customers Report",
        icon: "Users",
        bg: "bg-indigo-500/10",
        text: "text-indigo-300",
        border: "border-indigo-500/20",
        dotColor: "bg-indigo-400",
    },

    EMPLOYEES: {
        label: "Employees Report",
        icon: "Briefcase",
        bg: "bg-violet-500/10",
        text: "text-violet-300",
        border: "border-violet-500/20",
        dotColor: "bg-violet-400",
    },
};

export const REPORT_TYPES: ReportsTypes[] = [
    "SALES",
    "CUSTOMERS",
    "EMPLOYEES",
];