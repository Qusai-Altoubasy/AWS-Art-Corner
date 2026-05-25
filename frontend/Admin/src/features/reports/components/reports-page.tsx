import {useCallback, useEffect, useState} from "react";
import {PageHero} from "../../../shared/components/ui/page-hero.tsx";
import {ReportTypesTabs} from "./reports-types-tabs.tsx";
import {ReportDateFilter} from "./reports-data-filter.tsx";
import {ReportsTypes} from "../types/ReportsTypes";
import {useReportsStore} from "../store/useReportsStore.ts";
import {SalesReportSection} from "./sales-report-section.tsx";
import {CustomersReportSection} from "./customer-report-section.tsx";
import {LoadingState} from "../../../shared/components/ui/loading-state.tsx";
import {EmptyState} from "../../../shared/components/ui/empty-state.tsx";
import {toast} from "sonner";
import {BarChart3, RotateCw} from "lucide-react";
import {EmployeesReportSection} from "./employee-report-section.tsx";
import {Button} from "../../../shared/components/ui/button.tsx";

const DEFAULT_TYPE: ReportsTypes = "SALES";

export const ReportsPage = () => {
    const {
        salesReport,
        customerReport,
        employeeReport,
        loading,
        fetchSalesReport,
        fetchCustomerReport,
        fetchEmployeeReport,
    } = useReportsStore();

    const [activeType, setActiveType] = useState<ReportsTypes>(DEFAULT_TYPE);

    const [fromDate, setFromDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split("T")[0];
    });

    const [toDate, setToDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });

    const fetchCurrentReport = useCallback(async (isRefresh?: boolean) => {
        try {
            switch (activeType) {
                case "SALES":
                    await fetchSalesReport(fromDate, toDate, isRefresh);
                    break;
                case "CUSTOMERS":
                    await fetchCustomerReport(fromDate, toDate, isRefresh);
                    break;
                case "EMPLOYEES":
                    await fetchEmployeeReport(fromDate, toDate, isRefresh);
                    break;
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to fetch report");
        }
    }, [fetchCustomerReport, fetchEmployeeReport, fetchSalesReport, activeType, fromDate, toDate]);

    useEffect(() => {
        fetchCurrentReport().catch((error) => {
            toast.error(error instanceof Error ? error.message : "Failed to fetch report");
        });
    }, [fetchCurrentReport]);

    const handleTypeChange = useCallback((type: ReportsTypes) => {
        setActiveType(type);
    }, [setActiveType]);

    const handleRefresh = useCallback(() => {
        fetchCurrentReport(true).catch((error) => {
            toast.error(error instanceof Error ? error.message : "Failed to fetch report");
        });
    }, [fetchCurrentReport]);

    const getCurrentReport = () => {
        switch (activeType) {
            case "SALES":
                return salesReport;
            case "CUSTOMERS":
                return customerReport;
            case "EMPLOYEES":
                return employeeReport;
            default:
                return null;
        }
    };

    const isLoading = loading[activeType.toLowerCase() as keyof typeof loading];
    const currentReport = getCurrentReport();

    return (
        <main className="flex flex-col gap-8">
            <PageHero
                badge="ANALYTICS"
                title="Business"
                highlightedTitle="Reports"
                description="Comprehensive insights into sales, customers, and employee performance."
            />

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <ReportTypesTabs
                    activeType={activeType}
                    onTypeChange={handleTypeChange}
                />

                <ReportDateFilter
                    from={fromDate}
                    to={toDate}
                    onFromChange={setFromDate}
                    onToChange={setToDate}
                    disabled={isLoading}
                />

                <Button onClick={handleRefresh} loading={isLoading} title="Refresh">
                    <RotateCw size={20}/>
                </Button>
            </div>

            {isLoading && <LoadingState count={4}/>}

            {!isLoading && !currentReport && (
                <EmptyState
                    title="No Report Data"
                    description="Try changing the date range or select a different report type."
                    icon={BarChart3}
                />
            )}

            {!isLoading && currentReport && (
                <>
                    {activeType === "SALES" && salesReport && (
                        <SalesReportSection report={salesReport}/>
                    )}

                    {activeType === "CUSTOMERS" && customerReport && (
                        <CustomersReportSection report={customerReport}/>
                    )}

                    {activeType === "EMPLOYEES" && employeeReport && (
                        <EmployeesReportSection report={employeeReport}/>
                    )}
                </>
            )}
        </main>
    );
};