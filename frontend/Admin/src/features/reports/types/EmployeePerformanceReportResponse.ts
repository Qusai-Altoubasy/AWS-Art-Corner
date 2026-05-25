export interface EmployeePerformanceReportResponse {
    fromDate: string;
    toDate: string;

    employeeIds: string[];
    employeeNames: string[];
    employeeEmails: string[];

    employeeOrders: number[];
    employeeCompletedOrders: number[];

    employeeRevenues: number[];
    employeeProfits: number[];
}