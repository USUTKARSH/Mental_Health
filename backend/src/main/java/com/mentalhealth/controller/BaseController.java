package com.mentalhealth.controller;

import com.mentalhealth.model.User;
import com.mentalhealth.repository.UserRepository;
import org.springframework.security.core.Authentication;

public abstract class BaseController {
    protected final UserRepository userRepository;

    protected BaseController(UserRepository userRepository) { this.userRepository = userRepository; }

    protected String userId(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseGet(() -> userRepository.findByUsername(authentication.getName()).orElseThrow());
        return user.getId();
    }
}