package com.nexushr.auth;

import com.nexushr.auth.dto.LoginRequest;
import com.nexushr.auth.dto.LoginResponse;
import com.nexushr.auth.dto.MeResponse;
import com.nexushr.employee.Employee;
import com.nexushr.employee.EmployeeRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/users/me")
    @SecurityRequirement(name = "bearerAuth")
    public MeResponse me(Authentication authentication) {
        User user = userRepository.findByEmailIgnoreCase(authentication.getName()).orElseThrow();
        String fullName = employeeRepository.findByUserId(user.getId())
                .map(Employee::getFullName)
                .orElse(user.getEmail());
        return new MeResponse(user.getEmail(), user.getRole().getName(), fullName);
    }
}
