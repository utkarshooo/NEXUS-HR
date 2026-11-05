package com.nexushr.employee.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record CreateEmployeeRequest(
        @NotBlank(message = "Full name is required")
        @Size(max = 120, message = "Full name must be 120 characters or fewer") String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email")
        @Size(max = 150, message = "Email must be 150 characters or fewer") String email,

        @NotBlank(message = "Initial password is required")
        @Size(min = 8, max = 72, message = "Password must be 8 to 72 characters") String password,

        @NotBlank(message = "Role is required")
        @Pattern(regexp = "ADMIN|HR|MANAGER|EMPLOYEE", message = "Role must be ADMIN, HR, MANAGER or EMPLOYEE") String role,

        Long departmentId,

        @Size(max = 100, message = "Designation must be 100 characters or fewer") String designation,

        Long managerId,

        @NotNull(message = "Join date is required") LocalDate joinDate
) {}
