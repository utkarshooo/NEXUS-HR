package com.nexushr.employee;

import com.nexushr.auth.Role;
import com.nexushr.auth.RoleRepository;
import com.nexushr.auth.User;
import com.nexushr.auth.UserRepository;
import com.nexushr.common.BadRequestException;
import com.nexushr.common.ConflictException;
import com.nexushr.common.PageResponse;
import com.nexushr.common.ResourceNotFoundException;
import com.nexushr.employee.dto.*;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // ---------- reads ----------

    @Transactional(readOnly = true)
    public PageResponse<EmployeeResponse> list(String search, Long departmentId, String status, Pageable pageable) {
        Specification<Employee> spec = (root, query, cb) -> cb.isFalse(root.get("deleted"));

        if (search != null && !search.isBlank()) {
            String pattern = "%" + escapeLike(search.trim().toLowerCase()) + "%";
            spec = spec.and((root, query, cb) -> {
                Join<Employee, User> user = root.join("user", JoinType.LEFT);
                Predicate byName = cb.like(cb.lower(root.get("fullName")), pattern, '\\');
                Predicate byCode = cb.like(cb.lower(root.get("empCode")), pattern, '\\');
                Predicate byEmail = cb.like(cb.lower(user.get("email")), pattern, '\\');
                return cb.or(byName, byCode, byEmail);
            });
        }
        if (departmentId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("department").get("id"), departmentId));
        }
        if (status != null && !status.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        Page<Employee> page = employeeRepository.findAll(spec, pageable);
        return PageResponse.of(page, this::toResponse);
    }

    @Transactional(readOnly = true)
    public EmployeeResponse get(Long id) {
        return toResponse(findActive(id));
    }

    @Transactional(readOnly = true)
    public List<EmployeeOption> options() {
        return employeeRepository.findByDeletedFalseOrderByFullNameAsc().stream()
                .map(e -> new EmployeeOption(e.getId(), e.getFullName()))
                .toList();
    }

    // ---------- writes ----------

    @Transactional
    public EmployeeResponse create(CreateEmployeeRequest req, Authentication caller) {
        requireMayAssign(req.role(), caller);

        String email = req.email().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("An account with this email already exists");
        }

        Department department = resolveDepartment(req.departmentId());
        Employee manager = resolveManager(req.managerId(), null);
        Role role = roleRepository.findByName(req.role())
                .orElseThrow(() -> new BadRequestException("Unknown role"));

        User user = userRepository.save(User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(req.password()))
                .role(role)
                .build());

        Employee employee = employeeRepository.save(Employee.builder()
                .user(user)
                .empCode(String.format("NX-%04d", employeeRepository.nextEmpNumber()))
                .fullName(req.fullName().trim())
                .department(department)
                .designation(blankToNull(req.designation()))
                .manager(manager)
                .joinDate(req.joinDate())
                .build());

        return toResponse(employee);
    }

    @Transactional
    public EmployeeResponse update(Long id, UpdateEmployeeRequest req, Authentication caller) {
        Employee employee = findActive(id);
        User user = employee.getUser();
        boolean self = user.getEmail().equalsIgnoreCase(caller.getName());

        // Only admins may touch admin accounts or hand out the admin role.
        if (user.getRole().getName().equals("ADMIN") && !isAdmin(caller)) {
            throw new AccessDeniedException("Only an admin can change an admin account");
        }
        requireMayAssign(req.role(), caller);

        if (self && !user.getRole().getName().equals(req.role())) {
            throw new BadRequestException("You cannot change your own role");
        }
        if (self && !req.status().equals("ACTIVE")) {
            throw new BadRequestException("You cannot deactivate your own account");
        }

        Role role = roleRepository.findByName(req.role())
                .orElseThrow(() -> new BadRequestException("Unknown role"));

        employee.setFullName(req.fullName().trim());
        employee.setDepartment(resolveDepartment(req.departmentId()));
        employee.setDesignation(blankToNull(req.designation()));
        employee.setManager(resolveManager(req.managerId(), employee.getId()));
        employee.setJoinDate(req.joinDate());
        employee.setStatus(req.status());
        user.setRole(role);
        user.setEnabled(!req.status().equals("INACTIVE"));

        return toResponse(employee);
    }

    /** Soft delete: the row stays for audit and payroll history, the login is disabled. */
    @Transactional
    public void delete(Long id, Authentication caller) {
        Employee employee = findActive(id);
        User user = employee.getUser();

        if (user.getEmail().equalsIgnoreCase(caller.getName())) {
            throw new BadRequestException("You cannot delete your own account");
        }
        if (user.getRole().getName().equals("ADMIN") && !isAdmin(caller)) {
            throw new AccessDeniedException("Only an admin can delete an admin account");
        }

        employee.setDeleted(true);
        employee.setStatus("INACTIVE");
        user.setEnabled(false);
    }

    // ---------- departments ----------

    @Transactional(readOnly = true)
    public List<DepartmentResponse> departments() {
        return departmentRepository.findAll().stream()
                .sorted((a, b) -> a.getName().compareToIgnoreCase(b.getName()))
                .map(d -> new DepartmentResponse(d.getId(), d.getName()))
                .toList();
    }

    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest req) {
        String name = req.name().trim();
        if (departmentRepository.findByName(name).isPresent()) {
            throw new ConflictException("A department with this name already exists");
        }
        Department saved = departmentRepository.save(Department.builder().name(name).build());
        return new DepartmentResponse(saved.getId(), saved.getName());
    }

    // ---------- helpers ----------

    private Employee findActive(Long id) {
        return employeeRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
    }

    private Department resolveDepartment(Long id) {
        if (id == null) return null;
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }

    private Employee resolveManager(Long managerId, Long selfId) {
        if (managerId == null) return null;
        if (managerId.equals(selfId)) {
            throw new BadRequestException("An employee cannot be their own manager");
        }
        return employeeRepository.findByIdAndDeletedFalse(managerId)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
    }

    private void requireMayAssign(String role, Authentication caller) {
        if (role.equals("ADMIN") && !isAdmin(caller)) {
            throw new AccessDeniedException("Only an admin can assign the admin role");
        }
    }

    private boolean isAdmin(Authentication caller) {
        return caller.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private static String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }

    private static String escapeLike(String s) {
        return s.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }

    private EmployeeResponse toResponse(Employee e) {
        Department d = e.getDepartment();
        Employee m = e.getManager();
        return new EmployeeResponse(
                e.getId(), e.getEmpCode(), e.getFullName(),
                e.getUser().getEmail(), e.getUser().getRole().getName(),
                d != null ? d.getId() : null, d != null ? d.getName() : null,
                e.getDesignation(),
                m != null ? m.getId() : null, m != null ? m.getFullName() : null,
                e.getJoinDate(), e.getStatus());
    }
}
