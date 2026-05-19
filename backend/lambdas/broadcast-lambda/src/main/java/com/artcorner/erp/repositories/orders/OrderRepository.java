package com.artcorner.erp.repositories.orders;

import com.artcorner.erp.entities.orders.Order;
import com.artcorner.erp.entities.orders.OrderStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"customer", "items"})
    List<Order> findByCustomerIdAndStatus(UUID customerId, OrderStatus status);

    @EntityGraph(attributePaths = {"customer", "items"})
    List<Order> findByEmployeeIsNullAndStatus(OrderStatus status);

    @EntityGraph(attributePaths = {"customer", "items"})
    List<Order> findByEmployeeIdAndStatus(UUID employeeId, OrderStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Order> findWithLockById(Long id);

    @EntityGraph(attributePaths = {"items", "customer"})
    @Query("SELECT o FROM Order o WHERE o.id = :orderId")
    Optional<Order> findByIdWithItems(@Param("orderId") Long orderId);

    @EntityGraph(attributePaths = {"customer", "employee", "items", "items.product"})
    @Query("SELECT o FROM Order o WHERE " +
            "(:status IS NULL OR o.status = :status) AND " +
            "(:customerId IS NULL OR o.customer.id = :customerId)")
    List<Order> findAllOrdersWithFilters(@Param("status") OrderStatus status,
                                         @Param("customerId") UUID customerId);

}
