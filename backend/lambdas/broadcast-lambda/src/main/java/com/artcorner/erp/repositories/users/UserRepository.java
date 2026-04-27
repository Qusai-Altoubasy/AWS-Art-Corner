package com.artcorner.erp.repositories.users;

import com.artcorner.erp.entities.users.User;
import com.artcorner.erp.entities.users.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    List<User> findByRole(UserRole role);
}