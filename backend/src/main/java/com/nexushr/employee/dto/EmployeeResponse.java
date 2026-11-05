package com.nexushr.employee.dto;

import java.time.LocalDate;

public record EmployeeResponse(
        Long id,
        String empCode,
        String fullName,
        String email,
        String role,
        Long departmentId,
        String departmentName,
        String designation,
        Long managerId,
        String managerName,
        LocalDate joinDate,
        String status
) {}
