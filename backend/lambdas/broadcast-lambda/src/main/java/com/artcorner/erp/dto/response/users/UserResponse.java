package com.artcorner.erp.dto.response.users;

import lombok.Data;

import java.util.UUID;

@Data
public class UserResponse {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private boolean isActive;
    private Address address;

    @Data
    public static class Address {
        private String street;
        private String apartment;
        private String city;
    }
}
