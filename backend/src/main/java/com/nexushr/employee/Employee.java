package com.nexushr.employee;

import com.nexushr.auth.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "employees")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "emp_code", nullable = false, unique = true, length = 20)
    private String empCode;

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(length = 100)
    private String designation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Employee manager;

    @Column(name = "join_date", nullable = false)
    private LocalDate joinDate;

    @Builder.Default
    @Column(nullable = false, length = 20)
    private String status = "ACTIVE";

    @Builder.Default
    @Column(nullable = false)
    private boolean deleted = false;
}
