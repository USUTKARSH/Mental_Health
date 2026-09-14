package com.mentalhealth.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class AuthResponse {
    private String token;
    private String refreshToken;
    private String userId;
    private String email;
    private String username;
    private String firstName;
    private String lastName;
}