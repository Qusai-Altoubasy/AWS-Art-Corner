package com.artcorner.erp.mappers;

import com.artcorner.erp.components.sqs.OrderPlacedEvent;
import com.artcorner.erp.dto.response.orders.OrderResponse;
import com.artcorner.erp.entities.inventory.Product;
import com.artcorner.erp.entities.orders.Order;
import com.artcorner.erp.entities.users.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderMapper {

    public OrderResponse mapToOrderResponse(Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getItems().stream().map(orderItem ->{
            Product product = orderItem.getProduct();

            return OrderResponse.OrderItemResponse.builder()
                    .itemId(orderItem.getId())
                    .productId(product.getId())
                    .productName(product.getName())
                    .price(orderItem.getPrice())
                    .quantity(orderItem.getQuantity())
                    .build();
        }).toList();

        return OrderResponse.builder()
                .orderId(order.getId())
                .customerId(order.getCustomer().getId())
                .orderStatus(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .orderItemResponses(items)
                .build();
    }

    public OrderPlacedEvent mapToMessageBody(Order order) {
        List<OrderPlacedEvent.MessageOrderItem> items = order.getItems().stream().map(orderItem ->
                OrderPlacedEvent.MessageOrderItem.builder()
                .itemId(orderItem.getId())
                .productId(orderItem.getProduct().getId())
                .productName(orderItem.getProduct().getName())
                .quantity(orderItem.getQuantity())
                .price(orderItem.getPrice())
                .build()
        ).toList();

        User customer = order.getCustomer();

        return OrderPlacedEvent.builder()
                .orderId(order.getId())
                .orderStatus(order.getStatus())
                .customerId(customer.getId())
                .customerName(customer.getName())
                .customerPhone(customer.getPhone())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .messageOrderItems(items)
                .build();
    }
}
