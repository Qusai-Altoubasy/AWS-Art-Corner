package com.artcorner.erp.dto.request.users;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterUserRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String phone;

    @NotNull
    @Valid
    private Address address;

    @Data
    public static class Address {
        @NotBlank
        private String street;
        @NotBlank
        private String apartment;
        @NotBlank
        private String city;
    }
}
