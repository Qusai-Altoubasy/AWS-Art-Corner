package com.artcorner.erp.dto.response.reports;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class EmployeePerformanceReportResponse {

    private LocalDate fromDate;
    private LocalDate toDate;

    private List<UUID> employeeIds;
    private List<String> employeeNames;
    private List<String> employeeEmails;

    private List<Integer> employeeOrders;
    private List<Integer> employeeCompletedOrders;

    private List<BigDecimal> employeeRevenues;
    private List<BigDecimal> employeeProfits;
}