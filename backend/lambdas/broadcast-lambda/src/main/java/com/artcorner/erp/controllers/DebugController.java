package com.artcorner.erp.controllers;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    private final JdbcTemplate jdbcTemplate;

    public DebugController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/flyway")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> getFlywayHistory() {
        return jdbcTemplate.queryForList("SELECT version, description, success FROM flyway_schema_history");
    }

    @GetMapping("/schema")
    @PreAuthorize("hasRole('ADMIN')")
    public List<String> getTables() {
        return jdbcTemplate.queryForList(
                "SELECT table_name FROM information_schema.tables WHERE table_schema='public'",
                String.class
        );
    }

    @GetMapping("/getUserCon")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> getUserCon() {
        return jdbcTemplate.queryForList(
                """
                SELECT conname, pg_get_constraintdef(oid)
                FROM pg_constraint
                WHERE conname = 'check_user_role';
                """
        );
    }

    @GetMapping("/getOrderCon")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> getOrderCon() {
        return jdbcTemplate.queryForList(
                """
                SELECT conname, pg_get_constraintdef(oid)
                FROM pg_constraint
                WHERE conname = 'check_order_status';
                """
        );
    }

    @GetMapping("/users")
    public List<Map<String, Object>> getUsers() {
        return jdbcTemplate.queryForList("SELECT * FROM users");
    }

    @GetMapping("/orders")
    public List<Map<String, Object>> getOrders() {
        return jdbcTemplate.queryForList("SELECT * FROM orders");
    }

    @GetMapping("/order_items")
    public List<Map<String, Object>> getOrderItem() {
        return jdbcTemplate.queryForList("SELECT * FROM order_items");
    }

    @GetMapping("/products")
    public List<Map<String, Object>> getProducts() {
        return jdbcTemplate.queryForList("SELECT * FROM products");
    }
}