package com.artcorner.erp.components.sqs;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InventoryStockAlertEvent {
    private Long productId;
    private String productName;
    private int quantity;
}
