package com.artcorner.erp.dto.response.reports.projections;

import java.math.BigDecimal;
import java.util.UUID;

public interface CustomerReportProjection {

    UUID getCustomerId();
    String getCustomerName();
    String getCustomerEmail();

    Integer getOrders();
    Integer getCompletedOrders();

    BigDecimal getRevenue();
    BigDecimal getProfit();
}