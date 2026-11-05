package com.nexushr.employee.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record UpdateEmployeeRequest(
        @NotBlank(message = "Full name is required")
        @Size(max = 120, message = "Full name must be 120 characters or fewer") String fullName,

        @NotBlank(message = "Role is required")
        @Pattern(regexp = "ADMIN|HR|MANAGER|EMPLOYEE", message = "Role must be ADMIN, HR, MANAGER or EMPLOYEE") String role,

        Long departmentId,

        @Size(max = 100, message = "Designation must be 100 characters or fewer") String designation,

        Long managerId,

        @NotNull(message = "Join date is required") LocalDate joinDate,

        @NotBlank(message = "Status is required")
        @Pattern(regexp = "ACTIVE|ON_LEAVE|INACTIVE", message = "Status must be ACTIVE, ON_LEAVE or INACTIVE") String status
) {}
