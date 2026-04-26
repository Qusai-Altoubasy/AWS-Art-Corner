package com.artcorner.erp.controllers;

import com.artcorner.erp.dto.request.users.RegisterUserRequest;
import com.artcorner.erp.dto.response.users.UserResponse;
import com.artcorner.erp.entities.users.UserRole;
import com.artcorner.erp.services.users.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody RegisterUserRequest request) {
        userService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Sign up Successful");
    }

    @GetMapping("/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsersByRole(@PathVariable UserRole role) {
        return ResponseEntity.ok(userService.getAllUsersByRole(role));
    }

    @PatchMapping("/activation/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> activation(@PathVariable UUID id, @RequestParam boolean action) {
        userService.activation(id, action);
        return ResponseEntity.ok("Updated activation successfully");
    }
}
