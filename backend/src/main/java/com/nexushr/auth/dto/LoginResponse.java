package com.nexushr.auth.dto;

public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresInMs,
        String email,
        String role
) {}
