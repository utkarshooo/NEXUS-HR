package com.nexushr.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private static final String SECRET = "bmV4dXNoci1kZXYtb25seS1zZWNyZXQta2V5LWNoYW5nZS1tZS1pbi1wcm9kLTAxMjM0NTY3ODk=";

    @Test
    void generatedTokenCarriesSubjectAndRole() {
        JwtService jwt = new JwtService(SECRET, 60_000);
        Claims claims = jwt.parse(jwt.generate("hr@nexushr.com", "HR"));

        assertEquals("hr@nexushr.com", claims.getSubject());
        assertEquals("HR", claims.get("role", String.class));
    }

    @Test
    void expiredTokenIsRejected() {
        JwtService jwt = new JwtService(SECRET, -1_000);
        String token = jwt.generate("emp@nexushr.com", "EMPLOYEE");

        assertThrows(JwtException.class, () -> jwt.parse(token));
    }

    @Test
    void tamperedTokenIsRejected() {
        JwtService jwt = new JwtService(SECRET, 60_000);
        String token = jwt.generate("emp@nexushr.com", "EMPLOYEE");

        assertThrows(JwtException.class, () -> jwt.parse(token + "x"));
    }
}
