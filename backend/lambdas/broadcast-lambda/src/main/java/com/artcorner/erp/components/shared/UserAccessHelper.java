package com.artcorner.erp.components.shared;

import com.artcorner.erp.entities.users.UserRole;
import com.artcorner.erp.exceptions.inventory.InvalidRequestException;
import com.artcorner.erp.security.SecurityUtils;
import com.artcorner.erp.services.users.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UserAccessHelper {
    private final UserService userService;
    private final SecurityUtils securityUtils;

    public UUID resolveAndValidateCustomerId(UUID customerId) {
        if (customerId == null)
            return securityUtils.getCurrentUserId();

        if (!securityUtils.getCurrentUserRole().equals("EMPLOYEE"))
            throw new AccessDeniedException("You do not have permission to access other customer data");

        if (userService.findUserRoleById(customerId) != UserRole.CUSTOMER)
            throw new InvalidRequestException("The provided ID doesn't belong to a CUSTOMER");

        return customerId;
    }

    public UUID findEmployeeId() {
        if (!securityUtils.getCurrentUserRole().equals("EMPLOYEE"))
            throw new AccessDeniedException("You do not have permission to access other customer data");

        return securityUtils.getCurrentUserId();
    }

    public UUID findCustomerIdForAdmin(UUID customerId) {
        if (customerId == null)
            return null;

        if (!securityUtils.getCurrentUserRole().equals("ADMIN"))
            throw new AccessDeniedException("You do not have permission to access other customer data");

        if (userService.findUserRoleById(customerId) != UserRole.CUSTOMER)
            throw new InvalidRequestException("The provided ID doesn't belong to a CUSTOMER");

        return customerId;
    }

}
