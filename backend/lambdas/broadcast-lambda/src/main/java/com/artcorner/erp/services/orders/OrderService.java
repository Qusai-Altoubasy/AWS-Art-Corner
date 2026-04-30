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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

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

        Order order = orderOrchestrator.prepareOrder(customerId);

        orderOrchestrator.deleteItemsFromCart(customerId);

        orderRepository.save(order);

        OrderPlacedEvent orderPlacedEvent = orderMapper.mapToMessageBody(order);
        sqsSender.sendMessageToQueue(orderPlacedEvent);

        return orderMapper.mapToOrderResponse(order);
    }
}
