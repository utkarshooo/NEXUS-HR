package com.nexushr.auth;

import com.nexushr.auth.dto.LoginRequest;
import com.nexushr.auth.dto.LoginResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        // Throws AuthenticationException (-> 401) on bad credentials or disabled account.
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().trim(), request.password()));

        User user = userRepository.findByEmailIgnoreCase(auth.getName()).orElseThrow();
        user.setLastLogin(LocalDateTime.now());
        user.setFailedAttempts(0);

        String role = user.getRole().getName();
        String token = jwtService.generate(user.getEmail(), role);

        return new LoginResponse(token, "Bearer", jwtService.getAccessTtlMs(), user.getEmail(), role);
    }
}
