package com.artcorner.erp.services.reports;

import com.artcorner.erp.dto.response.reports.*;
import com.artcorner.erp.mappers.ReportMapper;
import com.artcorner.erp.repositories.reports.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final ReportMapper reportMapper;

    public SalesReportResponse getSalesReport(LocalDate from, LocalDate to) {
        return reportMapper.mapToSalesReport(from, to,
                reportRepository.findDailySales(from, to));
    }

    public CustomerOrdersReportResponse getCustomerOrdersReport(LocalDate from, LocalDate to) {
        return reportMapper.mapToCustomerReport(from, to,
                reportRepository.findCustomerRows(from, to));
    }

    public EmployeePerformanceReportResponse getEmployeePerformanceReport(LocalDate from, LocalDate to) {
        return reportMapper.mapToEmployeeReport(from, to,
                reportRepository.findEmployeeRows(from, to));
    }
}