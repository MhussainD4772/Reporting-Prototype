package com.enfos.reporting.report.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DepartmentRepository extends JpaRepository<Department, String> {

	@Query("SELECT d FROM Department d JOIN FETCH d.manager")
	List<Department> findAllWithManager();
}
