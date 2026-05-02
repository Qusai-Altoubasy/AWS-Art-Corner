package com.artcorner.erp.services.orders;

import com.artcorner.erp.components.shared.UserAccessHelper;
import com.artcorner.erp.components.sqs.OrderPlacedEvent;
import com.artcorner.erp.components.sqs.SqsSender;
import com.artcorner.erp.dto.response.orders.OrderResponse;
import com.artcorner.erp.entities.orders.Order;
import com.artcorner.erp.mappers.OrderMapper;
import com.artcorner.erp.repositories.orders.OrderRepository;
import com.artcorner.erp.components.orders.OrderOrchestrator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderOrchestrator orderOrchestrator;
    private final UserAccessHelper userAccessHelper;
    private final OrderMapper orderMapper;
    private final SqsSender sqsSender;

    @Transactional
    public OrderResponse createOrder(UUID customerId) {
        customerId = userAccessHelper.resolveAndValidateCustomerId(customerId);

        log.info("Starting order creation. inputCustomerId={}", customerId);

        Order order = orderOrchestrator.prepareOrder(customerId);

        log.info("Order prepared. itemsCount={}", order.getItems().size());

        orderOrchestrator.deleteItemsFromCart(customerId);

        log.info("Items deleted from cart. itemsCount={}", order.getItems().size());

        orderRepository.save(order);

        log.info("Order saved. orderId={}", order.getId());

        OrderPlacedEvent orderPlacedEvent = orderMapper.mapToMessageBody(order);
        sqsSender.sendMessageToQueue(orderPlacedEvent);

        log.info("Order event sent to SQS. orderId={}", order.getId());

        return orderMapper.mapToOrderResponse(order);
    }
}
