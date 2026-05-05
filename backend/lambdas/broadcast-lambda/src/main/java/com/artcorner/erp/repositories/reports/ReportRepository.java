package com.artcorner.erp.repositories.reports;

import com.artcorner.erp.dto.response.reports.projections.DailySalesReportProjection;
import com.artcorner.erp.dto.response.reports.projections.CustomerReportProjection;
import com.artcorner.erp.dto.response.reports.projections.EmployeeReportProjection;
import com.artcorner.erp.entities.orders.Order;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.Repository;

import java.time.LocalDate;
import java.util.List;

@org.springframework.stereotype.Repository
public interface ReportRepository extends Repository<Order, Long>{
    @Query(value = """
    WITH date_series AS (
        SELECT generate_series(:from, :to, '1 day'::interval)::date as report_date
    )
    SELECT
        ds.report_date as date,
        COUNT(o.id)::int as orders,
        COUNT(o.id) FILTER (WHERE o.status = 'COMPLETED')::int as completedOrders,
        COALESCE(SUM(o.total_amount), 0) as revenue,
        COALESCE(SUM(o.total_amount - o.total_cost), 0) as profit
    FROM date_series ds
    LEFT JOIN orders o
        ON o.created_at::date = ds.report_date
        AND o.is_active = true
    GROUP BY ds.report_date
    ORDER BY ds.report_date
    """, nativeQuery = true)
    List<DailySalesReportProjection> findDailySales(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query(value = """
    SELECT
        u.id as customerId,
        u.name as customerName,
        u.email as customerEmail,
        COUNT(o.id)::int as orders,
        COUNT(o.id) FILTER (WHERE o.status = 'COMPLETED')::int as completedOrders,
        COALESCE(SUM(o.total_amount), 0) as revenue,
        COALESCE(SUM(o.total_amount - o.total_cost), 0) as profit
    FROM users u
    INNER JOIN orders o ON o.customer_id = u.id
    WHERE o.created_at::date BETWEEN :from AND :to
      AND o.is_active = true
      AND u.is_active = true
    GROUP BY u.id, u.name, u.email
    ORDER BY revenue DESC
    """, nativeQuery = true)
    List<CustomerReportProjection> findCustomerRows(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query(value = """
    SELECT
        u.id as employeeId,
        u.name as employeeName,
        u.email as employeeEmail,
        COUNT(o.id)::int as orders,
        COUNT(o.id) FILTER (WHERE o.status = 'COMPLETED')::int as completedOrders,
        COALESCE(SUM(o.total_amount), 0) as revenue,
        COALESCE(SUM(o.total_amount - o.total_cost), 0) as profit
    FROM users u
    INNER JOIN orders o ON o.employee_id = u.id
    WHERE o.created_at::date BETWEEN :from AND :to
      AND o.is_active = true
      AND u.is_active = true
    GROUP BY u.id, u.name, u.email
    ORDER BY revenue DESC
    """, nativeQuery = true)
    List<EmployeeReportProjection> findEmployeeRows(@Param("from") LocalDate from, @Param("to") LocalDate to);
}
