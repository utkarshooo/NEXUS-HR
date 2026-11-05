package com.nexushr.employee;

import com.nexushr.auth.Role;
import com.nexushr.auth.RoleRepository;
import com.nexushr.auth.User;
import com.nexushr.auth.UserRepository;
import com.nexushr.common.BadRequestException;
import com.nexushr.common.ConflictException;
import com.nexushr.employee.dto.CreateEmployeeRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock EmployeeRepository employeeRepository;
    @Mock DepartmentRepository departmentRepository;
    @Mock UserRepository userRepository;
    @Mock RoleRepository roleRepository;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks EmployeeService service;

    private static Authentication caller(String email, String role) {
        return new UsernamePasswordAuthenticationToken(email, null,
                List.of(new SimpleGrantedAuthority("ROLE_" + role)));
    }

    private static CreateEmployeeRequest request(String email, String role) {
        return new CreateEmployeeRequest("Test Person", email, "Password@123", role,
                null, "Engineer", null, LocalDate.now());
    }

    @Test
    void createRejectsDuplicateEmail() {
        when(userRepository.existsByEmailIgnoreCase("taken@nexushr.com")).thenReturn(true);

        assertThrows(ConflictException.class,
                () -> service.create(request("taken@nexushr.com", "EMPLOYEE"), caller("hr@nexushr.com", "HR")));
    }

    @Test
    void hrCannotAssignAdminRole() {
        assertThrows(AccessDeniedException.class,
                () -> service.create(request("new@nexushr.com", "ADMIN"), caller("hr@nexushr.com", "HR")));
    }

    @Test
    void userCannotDeleteOwnAccount() {
        Role hrRole = new Role(2, "HR");
        User user = User.builder().email("hr@nexushr.com").role(hrRole).build();
        Employee self = Employee.builder().id(5L).user(user).fullName("Hina").build();
        when(employeeRepository.findByIdAndDeletedFalse(5L)).thenReturn(Optional.of(self));

        assertThrows(BadRequestException.class,
                () -> service.delete(5L, caller("hr@nexushr.com", "HR")));
    }
}
