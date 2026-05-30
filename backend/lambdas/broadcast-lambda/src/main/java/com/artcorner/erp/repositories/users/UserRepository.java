package com.artcorner.erp.repositories.users;

import com.artcorner.erp.entities.users.User;
import com.artcorner.erp.entities.users.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    List<User> findByRole(UserRole role);

    @Query("""
       SELECT u FROM User u
       WHERE u.role = :role
       AND u.isActive = true
       AND (
           LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%'))
           OR u.phone LIKE CONCAT('%', :query, '%')
       )
    """)
    List<User> searchCustomersForEmployee(UserRole role, String query);
}