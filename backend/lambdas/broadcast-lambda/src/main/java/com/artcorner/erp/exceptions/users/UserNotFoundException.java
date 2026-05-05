package com.artcorner.erp.exceptions.users;

import java.util.UUID;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(UUID id) {
        super("User with id " + id + " not found");
    }
}