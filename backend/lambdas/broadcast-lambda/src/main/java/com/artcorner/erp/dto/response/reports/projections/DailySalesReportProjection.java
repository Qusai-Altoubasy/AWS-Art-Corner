package com.artcorner.erp.dto.response.reports.projections;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface DailySalesReportProjection {
    LocalDate getDate();
    Integer getOrders();
    Integer getCompletedOrders();
    BigDecimal getRevenue();
    BigDecimal getProfit();
}