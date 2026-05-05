package com.artcorner.erp.dto.response.reports;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class SalesReportResponse {

    private LocalDate fromDate;
    private LocalDate toDate;

    private int totalOrders;
    private int completedOrders;

    private BigDecimal totalRevenue;
    private BigDecimal totalProfit;

    private List<BigDecimal> dailyRevenue;
    private List<BigDecimal> dailyProfit;
    private List<Integer> dailyOrders;
    private List<Integer> dailyCompletedOrders;
}