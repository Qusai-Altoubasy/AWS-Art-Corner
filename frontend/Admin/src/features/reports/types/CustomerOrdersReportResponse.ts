export interface CustomerOrdersReportResponse {
    fromDate: string;
    toDate: string;

    customerIds: string[];
    customerNames: string[];
    customerEmails: string[];

    customerOrders: number[];
    customerCompletedOrders: number[];

    customerRevenues: number[];
    customerProfits: number[];
}