package com.artcorner.erp.services.users;

import com.artcorner.erp.dto.request.users.RegisterUserRequest;
import com.artcorner.erp.dto.response.users.UserResponse;
import com.artcorner.erp.entities.users.Address;
import com.artcorner.erp.entities.users.User;
import com.artcorner.erp.entities.users.UserRole;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UsersMapping {

    public User mapToUserEntity(RegisterUserRequest request, UUID userId, String email, UserRole role) {
        if (request == null) {
            return null;
        }

        User user = new User();

        user.setId(userId);
        user.setEmail(email);
        user.setRole(role);

        user.setName(request.getName());
        user.setPhone(request.getPhone());
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
