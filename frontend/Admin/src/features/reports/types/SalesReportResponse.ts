export interface SalesReportResponse {
    fromDate: string;
    toDate: string;

    totalOrders: number;
    completedOrders: number;

    totalRevenue: number;
    totalProfit: number;

    dailyRevenue: number[];
    dailyProfit: number[];
    dailyOrders: number[];
    dailyCompletedOrders: number[];
}