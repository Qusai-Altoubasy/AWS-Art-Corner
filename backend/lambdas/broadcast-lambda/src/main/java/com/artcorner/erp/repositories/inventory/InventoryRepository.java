package com.artcorner.erp.repositories.inventory;

import com.artcorner.erp.dto.response.inventory.CustomerProductResponse;
import com.artcorner.erp.entities.inventory.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p.id as id, p.name as name, p.price as price, p.imageUrl as imageUrl" +
            " FROM Product p WHERE p.stock > p.stockThreshold")
    List<CustomerProductResponse> findAllProductsForCustomer();
}
