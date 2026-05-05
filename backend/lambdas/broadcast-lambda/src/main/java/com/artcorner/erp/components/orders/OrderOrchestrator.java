package com.artcorner.erp.components.orders;

import com.artcorner.erp.entities.inventory.Product;
import com.artcorner.erp.entities.cart.CartItem;
import com.artcorner.erp.entities.orders.Order;
import com.artcorner.erp.entities.orders.OrderItem;
import com.artcorner.erp.entities.orders.OrderStatus;
import com.artcorner.erp.entities.users.User;
import com.artcorner.erp.exceptions.inventory.InsufficientStockException;
import com.artcorner.erp.exceptions.orders.IllegalOrderStatusException;
import com.artcorner.erp.exceptions.orders.OrderStatusAlreadySetException;
import com.artcorner.erp.services.carts.CartService;
import com.artcorner.erp.services.inventory.InventoryService;
import com.artcorner.erp.services.users.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OrderOrchestrator {
    private final CartService cartService;
    private final InventoryService inventoryService;
    private final UserService userService;
    private static final int SCALE = 3;

    public Order preparePlacingOrder(UUID customerId) {
        User customer = userService.findUserById(customerId);

        List<CartItem> items = cartService.getAllItems(customerId.toString());

        Order order = new Order();
        List<OrderItem> orderItems = preparePlacingOrderItems(order, items);

        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;

        for (OrderItem orderItem : orderItems) {
            totalAmount = totalAmount.add(orderItem.getPrice());
            totalCost = totalCost.add(orderItem.getCost());
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        order.setTotalCost(totalCost);
        order.setCustomer(customer);
        return order;
    }

    private List<OrderItem> preparePlacingOrderItems(Order order, List<CartItem> cartItems) {
         return cartItems.stream().map(cartItem ->{
            Product product = inventoryService.findProductByIdWithLook(Long.valueOf(cartItem.getProductId()));

            int quantity = cartItem.getQuantity();
            validationPlacingQuantity(product, quantity);
            BigDecimal price = calculateItemPrice(product, quantity);
            BigDecimal cost = calculateItemCost(product, quantity);

            inventoryService.reduceProductQuantity(product, quantity);

            return OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(quantity)
                    .price(price)
                    .cost(cost)
                    .build();

        }).toList();
    }

    private void validationPlacingQuantity(Product product, int quantity) {
        if (product.getStock() < quantity) {
            throw new InsufficientStockException();
        }
    }

    private BigDecimal calculateItemPrice(Product product, int quantity) {
        return product.getPrice()
                .multiply(BigDecimal.valueOf(quantity))
                .setScale(SCALE, RoundingMode.HALF_EVEN);
    }

    private BigDecimal calculateItemCost(Product product, int quantity) {
        return product.getCost()
                .multiply(BigDecimal.valueOf(quantity))
                .setScale(SCALE, RoundingMode.HALF_EVEN);
    }

    public void deleteItemsFromCart(UUID customerId) {
        cartService.deleteAllItems(customerId.toString());
    }

    public void increaseProductsQuantities(List <OrderItem> items) {
        items.forEach(item ->
                inventoryService.increaseProductQuantity(item.getProduct(), item.getQuantity()));
    }

    public void validateNewOrderStatus(OrderStatus currentStatus, OrderStatus newStatus) {
        if (currentStatus == newStatus) {
            throw new OrderStatusAlreadySetException();
        }

        if (!currentStatus.canTransitionTo(newStatus)) {
            throw new IllegalOrderStatusException(currentStatus, newStatus);
        }
    }

    public User findEmployeeById(UUID employeeId){
        return userService.findUserById(employeeId);
    }
}
