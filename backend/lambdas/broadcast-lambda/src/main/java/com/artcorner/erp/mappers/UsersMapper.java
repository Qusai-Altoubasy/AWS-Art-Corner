package com.artcorner.erp.mappers;

import com.artcorner.erp.dto.request.users.RegisterUserRequest;
import com.artcorner.erp.dto.response.users.UserResponse;
import com.artcorner.erp.dto.response.users.UserSignupResponse;
import com.artcorner.erp.entities.users.Address;
import com.artcorner.erp.entities.users.User;
import com.artcorner.erp.entities.users.UserRole;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UsersMapper {

    public User mapToUserEntity(RegisterUserRequest request, UUID userId) {
        if (request == null) {
            return null;
        }

        User user = new User();
        user.setId(userId);
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setActive(true);

        if (request.getAddress() != null) {
            Address address = new Address();
            address.setStreet(request.getAddress().getStreet());
            address.setApartment(request.getAddress().getApartment());
            address.setCity(request.getAddress().getCity());

            address.setUser(user);
            user.setAddress(address);
        }

        return user;
    }

    public UserSignupResponse mapToUserSignupResponse(String email) {
        if (email == null) {
            return null;
        }

        return UserSignupResponse.builder()
                .email(email)
                .message("User registered successfully. A temporary password has been sent to the registered email.")
                .build();
    }

    public UserResponse mapToResponse(User user) {
        if (user == null) {
            return null;
        }

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setActive(user.isActive());

        if (user.getAddress() != null) {
            UserResponse.Address addressDto = new UserResponse.Address();
            addressDto.setStreet(user.getAddress().getStreet());
            addressDto.setApartment(user.getAddress().getApartment());
            addressDto.setCity(user.getAddress().getCity());
            response.setAddress(addressDto);
        } else {
            response.setAddress(new UserResponse.Address());
        }

        return response;
    }
}
