import {api} from "../../../app/config/api-config";
import {SalesReportResponse} from "../types/SalesReportResponse";
import {CustomerOrdersReportResponse} from "../types/CustomerOrdersReportResponse";
import {EmployeePerformanceReportResponse} from "../types/EmployeePerformanceReportResponse";

class ReportsRepository {
    async getSalesReport(from: string, to: string): Promise<SalesReportResponse> {
        const response = await api.get<SalesReportResponse>("/api/reports/sales", {
            params: {
                from,
                to,
            },
        });
        return response.data;
    }

    async getCustomerOrdersReport(from: string, to: string): Promise<CustomerOrdersReportResponse> {
        const response = await api.get<CustomerOrdersReportResponse>("/api/reports/customers", {
            params: {
                from,
                to,
            },
        });
        return response.data;
    }

    async getEmployeePerformanceReport(from: string, to: string): Promise<EmployeePerformanceReportResponse> {
        const response = await api.get<EmployeePerformanceReportResponse>("/api/reports/employees", {
            params: {
                from,
                to,
            },
        });
        return response.data;
    }
}

export const reportsRepository = new ReportsRepository();