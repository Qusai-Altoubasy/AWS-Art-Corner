package com.artcorner.erp.dto.response.users;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class CustomerResponseForEmployee {
    UUID customerId;
    String customerName;
    String customerPhone;
    String customerEmail;
}
