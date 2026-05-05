package com.artcorner.erp.services.orders;

import com.artcorner.erp.components.shared.UserAccessHelper;
import com.artcorner.erp.components.sqs.OrderPlacedEvent;
import com.artcorner.erp.components.sqs.OrderUpdatedEvent;
import com.artcorner.erp.components.sqs.SqsSender;
import com.artcorner.erp.dto.response.orders.OrderResponseForAdmin;
import com.artcorner.erp.dto.response.orders.OrderResponseForCustomer;
import com.artcorner.erp.dto.response.orders.OrderResponseForEmployee;
import com.artcorner.erp.entities.orders.Order;
import com.artcorner.erp.entities.orders.OrderStatus;
import com.artcorner.erp.entities.users.User;
import com.artcorner.erp.exceptions.orders.OrderNotFoundException;
import com.artcorner.erp.exceptions.orders.OrderNotPendingException;
import com.artcorner.erp.mappers.OrderMapper;
import com.artcorner.erp.repositories.orders.OrderRepository;
import com.artcorner.erp.components.orders.OrderOrchestrator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.access.AccessDeniedException;
import java.util.List;
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
    public OrderResponseForCustomer placeOrder(UUID customerId) {
        customerId = userAccessHelper.resolveAndValidateCustomerId(customerId);

        log.info("Starting order creation. inputCustomerId={}", customerId);

        Order order = orderOrchestrator.preparePlacingOrder(customerId);

        log.info("Order prepared. itemsCount={}", order.getItems().size());

        orderRepository.save(order);

        log.info("Order saved. orderId={}", order.getId());

        orderOrchestrator.deleteItemsFromCart(customerId);

        log.info("Items deleted from cart. itemsCount={}", order.getItems().size());

        OrderPlacedEvent orderPlacedEvent = orderMapper.mapToOrderPlacedEvent(order);
        sqsSender.sendMessageToQueue(orderPlacedEvent, "OrderPlaced", order.getId().toString());

        return orderMapper.mapToOrderResponseForCustomer(order);
    }

    public List<OrderResponseForCustomer> getOrdersForCustomerByStatus(OrderStatus status) {
        UUID customerId = userAccessHelper.resolveAndValidateCustomerId(null);

        log.info("Fetching Orders for customerID={}, status={}", customerId,  status);

        List<Order> orders = orderRepository.findByCustomerIdAndStatus(customerId, status);

        if (orders.isEmpty()) {
            return List.of();
        }

        return orders.stream().map(orderMapper::mapToOrderResponseForCustomer).toList();
    }

    private Order findOrderByIdWithItems(Long id) {
        return orderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
    }

    private Order findOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
    }

    private Order findOrderByIdWithLock(Long orderId) {
        return orderRepository.findWithLockById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
    }

    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = findOrderByIdWithItems(orderId);

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new OrderNotPendingException();
        }

        UUID currentCustomerId = userAccessHelper.resolveAndValidateCustomerId(null);
        if (!order.getCustomer().getId().equals(currentCustomerId)) {
            throw new AccessDeniedException("You are not authorized to cancel this order");
        }

        log.info("Canceling order and restoring stock. id={}", orderId);

        orderOrchestrator.increaseProductsQuantities(order.getItems());

        order.setStatus(OrderStatus.CANCELED);
        orderRepository.save(order);

        log.info("Order canceled successfully. orderId={}", orderId);
    }

    public List<OrderResponseForEmployee>  getOrdersForEmployeeByStatus(OrderStatus status) {
        UUID employeeId = userAccessHelper.findEmployeeId();
        log.info("Fetching Orders for employeeID={}, status={}", employeeId,  status);

        List<Order> orders;
        if (status == OrderStatus.PENDING) {
            orders = orderRepository.findByEmployeeIsNullAndStatus(status);
        } else {
            orders = orderRepository.findByEmployeeIdAndStatus(employeeId, status);
        }

        return orders.stream().map(orderMapper::mapToOrderResponseForEmployee).toList();
    }

    @Transactional
    public void updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = findOrderByIdWithLock(orderId);
        OrderStatus currentStatus = order.getStatus();

        log.info("Updating order status for orderId={}, oldStatus={}", orderId, order.getStatus());

        orderOrchestrator.validateNewOrderStatus(currentStatus, status);

        if (currentStatus == OrderStatus.PENDING && status == OrderStatus.ACCEPTED) {
            UUID employeeId = userAccessHelper.findEmployeeId();
            User employee = orderOrchestrator.findEmployeeById(employeeId);

            order.setEmployee(employee);
        }

        order.setStatus(status);
        orderRepository.save(order);
        log.info("Updated order status for orderId={}, newStatus={}", orderId, status);

        OrderUpdatedEvent orderUpdatedEvent = orderMapper.mapToOrderUpdatedEvent(order);
        sqsSender.sendMessageToQueue(orderUpdatedEvent, "OrderUpdated", orderId.toString());
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = findOrderById(orderId);
        log.info("Soft deleting order. orderId={}, currentStatus={}", orderId, order.getStatus());

        order.setActive(false);
        orderRepository.save(order);
        log.info("Order soft deleted successfully. orderId={}", orderId);
    }

    public List<OrderResponseForAdmin> getAllOrdersForAdmin(OrderStatus status, UUID customerId) {
        customerId = userAccessHelper.findCustomerIdForAdmin(customerId);

        log.info("Admin fetching orders with filters: status={}, customerId={}", status, customerId);

        List<Order> orders = orderRepository.findAllOrdersWithFilters(status, customerId);

        log.info("Total orders fetched for admin: {}", orders.size());

        return orders.stream()
                .map(orderMapper::mapToOrderResponseForAdmin)
                .toList();
    }
}
