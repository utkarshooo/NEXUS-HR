package com.nexushr.employee;

import com.nexushr.common.PageResponse;
import com.nexushr.employee.dto.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class EmployeeController {

    private static final Set<String> SORTABLE = Set.of("fullName", "empCode", "joinDate", "status");

    private final EmployeeService employeeService;

    @GetMapping("/employees")
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    public PageResponse<EmployeeResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fullName") String sort,
            @RequestParam(defaultValue = "asc") String dir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String status) {

        String sortField = SORTABLE.contains(sort) ? sort : "fullName";
        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        PageRequest pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50),
                Sort.by(direction, sortField).and(Sort.by("id")));

        return employeeService.list(search, departmentId, status, pageable);
    }

    @GetMapping("/employees/options")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public List<EmployeeOption> options() {
        return employeeService.options();
    }

    @GetMapping("/employees/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    public EmployeeResponse get(@PathVariable Long id) {
        return employeeService.get(id);
    }

    @PostMapping("/employees")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ResponseEntity<EmployeeResponse> create(@Valid @RequestBody CreateEmployeeRequest request,
                                                   Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.create(request, auth));
    }

    @PutMapping("/employees/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public EmployeeResponse update(@PathVariable Long id,
                                   @Valid @RequestBody UpdateEmployeeRequest request,
                                   Authentication auth) {
        return employeeService.update(id, request, auth);
    }

    @DeleteMapping("/employees/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        employeeService.delete(id, auth);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/departments")
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    public List<DepartmentResponse> departments() {
        return employeeService.departments();
    }

    @PostMapping("/departments")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ResponseEntity<DepartmentResponse> createDepartment(@Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.createDepartment(request));
    }
}
