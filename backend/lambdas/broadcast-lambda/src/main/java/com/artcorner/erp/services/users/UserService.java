package com.artcorner.erp.services.users;

import com.artcorner.erp.components.cognito.CognitoManager;
import com.artcorner.erp.dto.request.users.RegisterUserRequest;
import com.artcorner.erp.dto.response.users.UserResponse;
import com.artcorner.erp.dto.response.users.UserSignupResponse;
import com.artcorner.erp.entities.users.User;
import com.artcorner.erp.entities.users.UserRole;
import com.artcorner.erp.exceptions.users.UserNotFoundException;
import com.artcorner.erp.mappers.UsersMapper;
import com.artcorner.erp.repositories.users.UserRepository;
import com.artcorner.erp.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final UsersMapper usersMapper;
    private final CognitoManager cognitoManager;

    public User findUserById(UUID id) {
        log.debug("Fetching user by id={}", id);

        return userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User not found. id={}", id);
                    return new UserNotFoundException(id);
                });
    }

    public UserRole findUserRoleById(UUID id) {
        log.debug("Fetching user role. userId={}", id);

        return findUserById(id).getRole();
    }

    @Transactional
    public UserSignupResponse signUp(RegisterUserRequest request) {
        System.out.println("----------------before");
        log.info("Starting sign-up process for email: {}", request.getEmail());

        UUID cognitoUserId = cognitoManager.registerNewUser(
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );

        User user = usersMapper.mapToUserEntity(request, cognitoUserId);
        userRepository.save(user);

        log.info("Sign-up process completed successfully for user: {}", request.getEmail());

        System.out.println("----------------after");

        return usersMapper.mapToUserSignupResponse(user.getEmail());
    }

    public UserResponse login() {
        UUID id = securityUtils.getCurrentUserId();
        log.info("User fetching. userId={}", id);

        User user = findUserById(id);
        return usersMapper.mapToResponse(user);
    }

    private UserRole getCurrentUserRole() {
        String role = securityUtils.getCurrentUserRole();
        if (role == null) {
            log.debug("No role found in token. Defaulting to CUSTOMER");
            return UserRole.CUSTOMER;
        }
        return switch (role) {
            case "ADMIN" -> UserRole.ADMIN;
            case "EMPLOYEE" -> UserRole.EMPLOYEE;
            default -> UserRole.CUSTOMER;
        };
    }

    public List<UserResponse> getAllUsersByRole(UserRole role){
        log.info("Fetching users by role={}", role);

        List<User> users = userRepository.findByRole(role);

        log.info("Users fetched. role={}, count={}", role, users.size());

        return users.stream().map(usersMapper::mapToResponse).toList();
    }

    public void activation(UUID id, boolean active) {
        log.warn("User activation change requested. targetUserId={}, newStatus={}", id, active);

        User user = findUserById(id);
        user.setActive(active);
        userRepository.save(user);

        log.info("User activation updated. userId={}, active={}", id, active);
    }
}
