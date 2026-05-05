package com.artcorner.erp.mappers;

import com.artcorner.erp.dto.response.reports.*;
import com.artcorner.erp.dto.response.reports.projections.CustomerReportProjection;
import com.artcorner.erp.dto.response.reports.projections.DailySalesReportProjection;
import com.artcorner.erp.dto.response.reports.projections.EmployeeReportProjection;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class ReportMapper {

    public SalesReportResponse mapToSalesReport(LocalDate from, LocalDate to, List<DailySalesReportProjection> rows) {
        int totalOrders = 0;
        int completedOrders = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal totalProfit = BigDecimal.ZERO;

        List<BigDecimal> dailyRevenue = new ArrayList<>();
        List<BigDecimal> dailyProfit = new ArrayList<>();
        List<Integer> dailyOrders = new ArrayList<>();
        List<Integer> dailyCompletedOrders = new ArrayList<>();

        for (DailySalesReportProjection row : rows) {
            totalOrders += row.getOrders();
            completedOrders += row.getCompletedOrders();

            totalRevenue = totalRevenue.add(row.getRevenue());
            totalProfit = totalProfit.add(row.getProfit());

            dailyRevenue.add(row.getRevenue());
            dailyProfit.add(row.getProfit());
            dailyOrders.add(row.getOrders());
            dailyCompletedOrders.add(row.getCompletedOrders());
        }

        return SalesReportResponse.builder()
                .fromDate(from)
                .toDate(to)
                .totalOrders(totalOrders)
                .completedOrders(completedOrders)
                .totalRevenue(totalRevenue)
                .totalProfit(totalProfit)
                .dailyRevenue(dailyRevenue)
                .dailyProfit(dailyProfit)
                .dailyOrders(dailyOrders)
                .dailyCompletedOrders(dailyCompletedOrders)
                .build();
    }

    public CustomerOrdersReportResponse mapToCustomerReport(LocalDate from, LocalDate to, List<CustomerReportProjection> rows) {
        List<UUID> customerIds = new ArrayList<>();
        List<String> customerNames = new ArrayList<>();
        List<String> customerEmails = new ArrayList<>();

        List<Integer> customerOrders = new ArrayList<>();
        List<Integer> customerCompletedOrders = new ArrayList<>();

        List<BigDecimal> customerRevenues = new ArrayList<>();
        List<BigDecimal> customerProfits = new ArrayList<>();

        for (CustomerReportProjection row : rows) {
            customerIds.add(row.getCustomerId());
            customerNames.add(row.getCustomerName());
            customerEmails.add(row.getCustomerEmail());

            customerOrders.add(row.getOrders());
            customerCompletedOrders.add(row.getCompletedOrders());

            customerRevenues.add(row.getRevenue());
            customerProfits.add(row.getProfit());
        }

        return CustomerOrdersReportResponse.builder()
                .fromDate(from)
                .toDate(to)
                .customerIds(customerIds)
                .customerNames(customerNames)
                .customerEmails(customerEmails)
                .customerOrders(customerOrders)
                .customerCompletedOrders(customerCompletedOrders)
                .customerRevenues(customerRevenues)
                .customerProfits(customerProfits)
                .build();
    }

    public EmployeePerformanceReportResponse mapToEmployeeReport(LocalDate from, LocalDate to, List<EmployeeReportProjection> rows) {
        List<UUID> employeeIds = new ArrayList<>();
        List<String> employeeNames = new ArrayList<>();
        List<String> employeeEmails = new ArrayList<>();

        List<Integer> employeeOrders = new ArrayList<>();
        List<Integer> employeeCompletedOrders = new ArrayList<>();

        List<BigDecimal> employeeRevenues = new ArrayList<>();
        List<BigDecimal> employeeProfits = new ArrayList<>();

        for (EmployeeReportProjection row : rows) {
            employeeIds.add(row.getEmployeeId());
            employeeNames.add(row.getEmployeeName());
            employeeEmails.add(row.getEmployeeEmail());

            employeeOrders.add(row.getOrders());
            employeeCompletedOrders.add(row.getCompletedOrders());

            employeeRevenues.add(row.getRevenue());
            employeeProfits.add(row.getProfit());
        }

        return EmployeePerformanceReportResponse.builder()
                .fromDate(from)
                .toDate(to)
                .employeeIds(employeeIds)
                .employeeNames(employeeNames)
                .employeeEmails(employeeEmails)
                .employeeOrders(employeeOrders)
                .employeeCompletedOrders(employeeCompletedOrders)
                .employeeRevenues(employeeRevenues)
                .employeeProfits(employeeProfits)
                .build();
    }
}