package com.artcorner.erp.repositories.inventory;

import com.artcorner.erp.dto.response.inventory.CustomerProductResponse;
import com.artcorner.erp.entities.inventory.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p.id as id, p.name as name, p.price as price, p.imageUrl as imageUrl" +
            " FROM Product p WHERE p.stock > p.stockThreshold")
    List<CustomerProductResponse> findAllProductsForCustomer();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Product> findWithLockById(Long id);

    @Modifying
    @Query("UPDATE Product p SET p.stock = p.stock + :quantity WHERE p.id = :productId")
    void incrementStock(@Param("productId") Long productId, @Param("quantity") int quantity);
}
