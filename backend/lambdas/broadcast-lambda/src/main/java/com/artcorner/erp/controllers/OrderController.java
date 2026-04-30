package com.artcorner.erp.controllers;

import com.artcorner.erp.dto.response.orders.OrderResponse;
import com.artcorner.erp.services.orders.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'CUSTOMER')")
    public ResponseEntity<OrderResponse> createOrder(@RequestParam(required = false) UUID customerId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(customerId));
    }

}
