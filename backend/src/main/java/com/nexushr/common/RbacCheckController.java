package com.nexushr.common;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Day 2 proof that role-based access works. Delete this controller once real modules exist.
 *  - /check/me: any signed-in user
 *  - /check/hr: HR and ADMIN only (EMPLOYEE and MANAGER get 403)
 */
@RestController
@RequestMapping("/api/v1/check")
@SecurityRequirement(name = "bearerAuth")
public class RbacCheckController {

    @GetMapping("/me")
    public Map<String, Object> me(Authentication auth) {
        return Map.of("user", auth.getName(), "authorities", auth.getAuthorities().toString());
    }

    @GetMapping("/hr")
    @PreAuthorize("hasAnyRole('HR','ADMIN')")
    public Map<String, String> hrOnly(Authentication auth) {
        return Map.of("message", "HR area reached", "user", auth.getName());
    }
}
