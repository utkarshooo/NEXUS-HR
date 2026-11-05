package com.nexushr.common;

import com.nexushr.auth.Role;
import com.nexushr.auth.RoleRepository;
import com.nexushr.auth.User;
import com.nexushr.auth.UserRepository;
import com.nexushr.employee.Department;
import com.nexushr.employee.DepartmentRepository;
import com.nexushr.employee.Employee;
import com.nexushr.employee.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/** Creates one demo user per role in the dev profile. Skips anything that already exists. */
@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevDataSeeder implements CommandLineRunner {

    private static final String DEV_PASSWORD = "Password@123";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        Department hr = department("Human Resources");
        Department eng = department("Engineering");

        seed("admin@nexushr.com", "ADMIN", "NX-0001", "System Admin", hr, "Administrator", null);
        seed("hr@nexushr.com", "HR", "NX-0002", "Hina Rao", hr, "HR Manager", null);
        Employee mgr = seed("manager@nexushr.com", "MANAGER", "NX-0003", "Manav Mehta", eng, "Engineering Lead", null);
        seed("emp@nexushr.com", "EMPLOYEE", "NX-0004", "Esha Singh", eng, "Software Engineer", mgr);

        log.info("Dev users ready (password for all: {}): admin@, hr@, manager@, emp@ nexushr.com", DEV_PASSWORD);
    }

    private Department department(String name) {
        return departmentRepository.findByName(name)
                .orElseGet(() -> departmentRepository.save(Department.builder().name(name).build()));
    }

    private Employee seed(String email, String roleName, String empCode, String fullName,
                          Department dept, String designation, Employee manager) {
        User user = userRepository.findByEmailIgnoreCase(email).orElseGet(() -> {
            Role role = roleRepository.findByName(roleName).orElseThrow();
            return userRepository.save(User.builder()
                    .email(email)
                    .passwordHash(passwordEncoder.encode(DEV_PASSWORD))
                    .role(role)
                    .build());
        });

        return employeeRepository.findByUserId(user.getId()).orElseGet(() ->
                employeeRepository.save(Employee.builder()
                        .user(user).empCode(empCode).fullName(fullName)
                        .department(dept).designation(designation).manager(manager)
                        .joinDate(LocalDate.now().minusYears(1))
                        .build()));
    }
}
