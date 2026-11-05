package com.nexushr.employee;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {

    Optional<Employee> findByUserId(Long userId);

    boolean existsByEmpCode(String empCode);

    @EntityGraph(attributePaths = {"department", "manager", "user", "user.role"})
    Optional<Employee> findByIdAndDeletedFalse(Long id);

    @Override
    @EntityGraph(attributePaths = {"department", "manager", "user", "user.role"})
    Page<Employee> findAll(Specification<Employee> spec, Pageable pageable);

    List<Employee> findByDeletedFalseOrderByFullNameAsc();

    @Query(value = "SELECT nextval('emp_code_seq')", nativeQuery = true)
    long nextEmpNumber();
}
