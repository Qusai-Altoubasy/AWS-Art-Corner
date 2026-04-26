package com.artcorner.erp.repositories.inventory;

import com.artcorner.erp.entities.inventory.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Product, Long> {

}
