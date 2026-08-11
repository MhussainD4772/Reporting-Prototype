package com.enfos.reporting.report.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProjectRepository extends JpaRepository<Project, String> {

	@Query("""
			SELECT p FROM Project p
			JOIN FETCH p.department
			JOIN FETCH p.owner
			""")
	List<Project> findAllWithDepartmentAndOwner();
}
