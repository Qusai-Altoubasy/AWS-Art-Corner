package com.artcorner.erp.dto.response.reports;


import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class CustomerOrdersReportResponse {

    private LocalDate fromDate;
    private LocalDate toDate;

    private List<UUID> customerIds;
    private List<String> customerNames;
    private List<String> customerEmails;

    private List<Integer> customerOrders;
    private List<Integer> customerCompletedOrders;

    private List<BigDecimal> customerRevenues;
    private List<BigDecimal> customerProfits;
}