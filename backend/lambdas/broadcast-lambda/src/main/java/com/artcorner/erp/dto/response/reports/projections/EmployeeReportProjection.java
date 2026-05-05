package com.artcorner.erp.dto.response.reports.projections;

import java.math.BigDecimal;
import java.util.UUID;

public interface EmployeeReportProjection {

    UUID getEmployeeId();
    String getEmployeeName();
    String getEmployeeEmail();

    Integer getOrders();
    Integer getCompletedOrders();

    BigDecimal getRevenue();
    BigDecimal getProfit();
}