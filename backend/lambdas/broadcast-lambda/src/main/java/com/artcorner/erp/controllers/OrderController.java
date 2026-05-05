package com.artcorner.erp.controllers;

import com.artcorner.erp.dto.response.orders.OrderResponseForAdmin;
import com.artcorner.erp.dto.response.orders.OrderResponseForCustomer;
import com.artcorner.erp.dto.response.orders.OrderResponseForEmployee;
import com.artcorner.erp.entities.orders.OrderStatus;
import com.artcorner.erp.services.orders.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'CUSTOMER')")
    public ResponseEntity<OrderResponseForCustomer> placeOrder(@RequestParam(required = false) UUID customerId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.placeOrder(customerId));
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderResponseForCustomer>> getOrdersForCustomerByStatus(@RequestParam OrderStatus status){
        return ResponseEntity.ok(orderService.getOrdersForCustomerByStatus(status));
    }

    @PatchMapping("/customer/{orderId}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<String> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok("Order has been cancelled");
    }

    @GetMapping("/employee")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<OrderResponseForEmployee>> getOrdersForEmployeeByStatus(@RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.getOrdersForEmployeeByStatus(status));
    }

    @PatchMapping("/employee/{orderId}/status")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok("Order status has been updated");
    }

    @DeleteMapping("/{orderId}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> DeleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponseForAdmin>> getAllOrdersForAdmin(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) UUID customerId) {
        return ResponseEntity.ok(orderService.getAllOrdersForAdmin(status, customerId));
    }
}
