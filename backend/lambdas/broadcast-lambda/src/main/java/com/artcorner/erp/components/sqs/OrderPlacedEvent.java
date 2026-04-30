package com.artcorner.erp.components.sqs;

import com.artcorner.erp.entities.orders.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class OrderPlacedEvent {
    private Long orderId;
    private OrderStatus orderStatus;

    private UUID customerId;
    private String customerName;
    private String customerPhone;

    private BigDecimal totalAmount;
    private LocalDateTime createdAt;

    private List<MessageOrderItem>  messageOrderItems;

    @Data
    @Builder
    public static class MessageOrderItem {
        private Long itemId;
        private Long productId;
        private String productName;
        private int quantity;
        private BigDecimal price;

    }
}
