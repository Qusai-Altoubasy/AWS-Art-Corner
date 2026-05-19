package com.artcorner.erp.mappers;

import com.artcorner.erp.components.sqs.OrderPlacedEvent;
import com.artcorner.erp.components.sqs.OrderUpdatedEvent;
import com.artcorner.erp.dto.response.orders.OrderResponseForAdmin;
import com.artcorner.erp.dto.response.orders.OrderResponseForCustomer;
import com.artcorner.erp.dto.response.orders.OrderResponseForEmployee;
import com.artcorner.erp.entities.inventory.Product;
import com.artcorner.erp.entities.orders.Order;
import com.artcorner.erp.entities.orders.OrderStatus;
import com.artcorner.erp.entities.users.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderMapper {

    public OrderResponseForCustomer mapToOrderResponseForCustomer(Order order) {
        List<OrderResponseForCustomer.OrderItemResponse> items = order.getItems().stream().map(orderItem ->{
            Product product = orderItem.getProduct();

            return OrderResponseForCustomer.OrderItemResponse.builder()
                    .itemId(orderItem.getId())
                    .productId(product.getId())
                    .productName(product.getName())
                    .price(orderItem.getPrice())
                    .quantity(orderItem.getQuantity())
                    .build();
        }).toList();

        return OrderResponseForCustomer.builder()
                .orderId(order.getId())
                .customerId(order.getCustomer().getId())
                .orderStatus(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .orderItemResponses(items)
                .build();
    }

    public OrderPlacedEvent mapToOrderPlacedEvent(Order order) {
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
                .customerEmail(customer.getEmail())
                .customerPhone(customer.getPhone())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .messageOrderItems(items)
                .build();
    }

    public OrderResponseForEmployee mapToOrderResponseForEmployee(Order order) {
        List<OrderResponseForEmployee.OrderItemResponse> items = order.getItems().stream().map(orderItem ->
                OrderResponseForEmployee.OrderItemResponse.builder()
                        .itemId(orderItem.getId())
                        .productId(orderItem.getProduct().getId())
                        .productName(orderItem.getProduct().getName())
                        .quantity(orderItem.getQuantity())
                        .price(orderItem.getPrice())
                        .build()
        ).toList();

        User customer = order.getCustomer();

        return OrderResponseForEmployee.builder()
                .orderId(order.getId())
                .orderStatus(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .customerId(customer.getId())
                .customerName(customer.getName())
                .customerEmail(customer.getEmail())
                .customerPhone(customer.getPhone())
                .orderItemResponses(items)
                .build();
    }

    public OrderUpdatedEvent mapToOrderUpdatedEvent(Order order) {
        User customer = order.getCustomer();

        return OrderUpdatedEvent.builder()
                .orderId(order.getId())
                .orderStatus(order.getStatus())
                .customerId(customer.getId())
                .customerName(customer.getName())
                .customerPhone(customer.getPhone())
                .customerEmail(customer.getEmail())
                .totalAmount(order.getTotalAmount())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    public OrderResponseForAdmin mapToOrderResponseForAdmin(Order order) {
        return OrderResponseForAdmin.builder()
                .orderId(order.getId())
                .status(order.getStatus())

                .customerId(order.getCustomer().getId())
                .customerName(order.getCustomer().getName())
                .customerEmail(order.getCustomer().getEmail())

                .employeeId(order.getStatus() != OrderStatus.PENDING ? order.getEmployee().getId() : null)
                .employeeName(order.getStatus() != OrderStatus.PENDING ? order.getEmployee().getName() : null)
                .employeeEmail(order.getStatus() != OrderStatus.PENDING ? order.getEmployee().getEmail() : null)

                .totalAmount(order.getTotalAmount())
                .totalCost(order.getTotalCost())

                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())

                .items(order.getItems().stream()
                        .map(item -> OrderResponseForAdmin.OrderItemForAdmin.builder()
                                .productId(item.getProduct().getId())
                                .productName(item.getProduct().getName())
                                .quantity(item.getQuantity())
                                .price(item.getPrice())
                                .cost(item.getCost())
                                .build())
                        .toList())
                .build();
    }
}
