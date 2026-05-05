package com.artcorner.erp.components.sqs;

import com.artcorner.erp.entities.orders.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class OrderUpdatedEvent {
    private Long orderId;
    private OrderStatus orderStatus;

    private UUID customerId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;

    private BigDecimal totalAmount;
    private LocalDateTime updatedAt;
}
