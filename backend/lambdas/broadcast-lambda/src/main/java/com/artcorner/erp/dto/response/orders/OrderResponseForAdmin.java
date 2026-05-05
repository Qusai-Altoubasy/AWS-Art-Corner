package com.artcorner.erp.dto.response.orders;

import com.artcorner.erp.entities.orders.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class OrderResponseForAdmin {
    private Long orderId;
    private OrderStatus status;

    private UUID customerId;
    private String customerName;
    private String customerEmail;

    private UUID employeeId;
    private String employeeName;
    private String employeeEmail;

    private BigDecimal totalAmount;
    private BigDecimal totalCost;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<OrderItemForAdmin> items;

    @Data
    @Builder
    public static class OrderItemForAdmin {
        private Long productId;
        private String productName;
        private int quantity;

        private BigDecimal price;
        private BigDecimal cost;
    }
}