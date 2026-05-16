package com.artcorner.erp.dto.request.users;

import com.artcorner.erp.entities.users.UserRole;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterUserRequest {

    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String name;

    @NotBlank
    private String phone;

    @NotNull
    private UserRole role;

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
