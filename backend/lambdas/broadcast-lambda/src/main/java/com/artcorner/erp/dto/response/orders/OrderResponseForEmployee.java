package com.artcorner.erp.dto.response.orders;

import com.artcorner.erp.entities.orders.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class OrderResponseForEmployee {
    private Long orderId;
    private OrderStatus orderStatus;
    private BigDecimal totalAmount;

    private UUID customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
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
