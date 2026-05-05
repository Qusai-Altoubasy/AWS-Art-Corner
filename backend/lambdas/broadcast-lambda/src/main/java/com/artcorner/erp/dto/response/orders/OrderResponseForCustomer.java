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
public class OrderResponseForCustomer {
    private Long orderId;
    private UUID customerId;
    private OrderStatus orderStatus;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> orderItemResponses;

    @Data
    @Builder
    public static class OrderItemResponse {
        private Long itemId;
        private Long productId;
        private String productName;
        private int quantity;
        private BigDecimal price;
    }

}
