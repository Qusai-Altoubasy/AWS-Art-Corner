package com.artcorner.erp.repositories.users;

import com.artcorner.erp.entities.users.User;
import com.artcorner.erp.entities.users.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    List<User> findByRole(UserRole role);
}