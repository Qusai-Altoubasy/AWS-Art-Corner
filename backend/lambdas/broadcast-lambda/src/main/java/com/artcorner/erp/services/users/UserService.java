package com.artcorner.erp.services.users;

import com.artcorner.erp.dto.request.users.RegisterUserRequest;
import com.artcorner.erp.dto.response.users.UserResponse;
import com.artcorner.erp.entities.users.User;
import com.artcorner.erp.entities.users.UserRole;
import com.artcorner.erp.exceptions.UserNotFoundException;
import com.artcorner.erp.repositories.users.UserRepository;
import com.artcorner.erp.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final UsersMapping usersMapping;

    public User findUserById(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
    }

    @Transactional
    public void signUp(RegisterUserRequest request) {
        if (userRepository.existsById(securityUtils.getCurrentUserId())) {
            throw new IllegalArgumentException("User already registered");
        }

        User user = usersMapping.mapToUserEntity(
                request,
                securityUtils.getCurrentUserId(),
                securityUtils.getCurrentUserEmail(),
                getCurrentUserRole()
        );

        userRepository.save(user);
    }

    private UserRole getCurrentUserRole() {
        String role = securityUtils.getCurrentUserRole();
        if (role == null) return UserRole.customer;
        return switch (role) {
            case "Admin" -> UserRole.Admin;
            case "employee" -> UserRole.employee;
            default -> UserRole.customer;
        };
    }

    public List<UserResponse> getAllUsersByRole(UserRole role){
        List<User> users = userRepository.findByRole(role);

        return users.stream().map(usersMapping::mapToResponse).toList();
    }

    public void activation(UUID id, boolean active) {
        User user = findUserById(id);
        user.setActive(active);
        userRepository.save(user);
    }

}
