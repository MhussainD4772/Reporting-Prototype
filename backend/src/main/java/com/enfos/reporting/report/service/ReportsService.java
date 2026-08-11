package com.enfos.reporting.report.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.enfos.reporting.report.persistence.Department;
import com.enfos.reporting.report.persistence.DepartmentRepository;
import com.enfos.reporting.report.persistence.Project;
import com.enfos.reporting.report.persistence.ProjectRepository;
import com.enfos.reporting.report.persistence.User;
import com.enfos.reporting.report.persistence.UserRepository;
import com.enfos.reporting.report.web.ColumnDefinition;
import com.enfos.reporting.report.web.ReportDetail;
import com.enfos.reporting.report.web.ReportSummary;

@Service
public class ReportsService {

	private final UserRepository userRepository;
	private final DepartmentRepository departmentRepository;
	private final ProjectRepository projectRepository;

	public ReportsService(
			UserRepository userRepository,
			DepartmentRepository departmentRepository,
			ProjectRepository projectRepository) {
		this.userRepository = userRepository;
		this.departmentRepository = departmentRepository;
		this.projectRepository = projectRepository;
	}

	private static final Instant SEEDED_AT = Instant.now();

	private static final List<ReportCatalogEntry> CATALOG = List.of(
			new ReportCatalogEntry(
					"users",
					"Users",
					"People in the system",
					SEEDED_AT.minus(1, ChronoUnit.DAYS),
					List.of(
							new ColumnDefinition("userId", "User ID", "string"),
							new ColumnDefinition("name", "Name", "string"),
							new ColumnDefinition("email", "Email", "string"),
							new ColumnDefinition("role", "Role", "string"),
							new ColumnDefinition("status", "Status", "string"),
							new ColumnDefinition("createdDate", "Created Date", "datetime"))),
			new ReportCatalogEntry(
					"departments",
					"Departments",
					"Org structure",
					SEEDED_AT.minus(20, ChronoUnit.DAYS),
					List.of(
							new ColumnDefinition("departmentId", "Department ID", "string"),
							new ColumnDefinition("departmentName", "Department Name", "string"),
							new ColumnDefinition("manager", "Manager", "string"),
							new ColumnDefinition("employeeCount", "Employee Count", "number"),
							new ColumnDefinition("location", "Location", "string"))),
			new ReportCatalogEntry(
					"projects",
					"Projects",
					"Active and past work",
					SEEDED_AT.minus(6, ChronoUnit.DAYS),
					List.of(
							new ColumnDefinition("projectId", "Project ID", "string"),
							new ColumnDefinition("projectName", "Project Name", "string"),
							new ColumnDefinition("department", "Department", "string"),
							new ColumnDefinition("owner", "Owner", "string"),
							new ColumnDefinition("status", "Status", "string"),
							new ColumnDefinition("startDate", "Start Date", "date"),
							new ColumnDefinition("endDate", "End Date", "date"))));

	public List<ReportSummary> listReports() {
		return CATALOG.stream()
				.map(entry -> new ReportSummary(
						entry.id(),
						entry.name(),
						entry.description(),
						entry.lastUpdated()))
				.toList();
	}

	public ReportDetail getReport(String id) {
		return CATALOG.stream()
				.filter(entry -> entry.id().equals(id))
				.findFirst()
				.map(entry -> new ReportDetail(
						entry.id(),
						entry.name(),
						entry.description(),
						entry.lastUpdated(),
						entry.columns(),
						rowsFor(entry.id())))
				.orElseThrow(() -> new IllegalArgumentException("Unknown report: " + id));
	}

	private List<Map<String, Object>> rowsFor(String id) {
		return switch (id) {
			case "users" -> userRepository.findAll().stream().map(this::toUserRow).toList();
			case "departments" -> departmentRepository.findAllWithManager().stream()
					.map(this::toDepartmentRow)
					.toList();
			case "projects" -> projectRepository.findAllWithDepartmentAndOwner().stream()
					.map(this::toProjectRow)
					.toList();
			default -> List.of();
		};
	}

	private Map<String, Object> toUserRow(User user) {
		return Map.of(
				"userId", user.getId(),
				"name", user.getName(),
				"email", user.getEmail(),
				"role", user.getRole(),
				"status", user.getStatus(),
				"createdDate", user.getCreatedDate());
	}

	private Map<String, Object> toDepartmentRow(Department department) {
		return Map.of(
				"departmentId", department.getId(),
				"departmentName", department.getName(),
				"manager", department.getManager().getName(),
				"employeeCount", department.getEmployeeCount(),
				"location", department.getLocation());
	}

	private Map<String, Object> toProjectRow(Project project) {
		Map<String, Object> row = new LinkedHashMap<>();
		row.put("projectId", project.getId());
		row.put("projectName", project.getName());
		row.put("department", project.getDepartment().getName());
		row.put("owner", project.getOwner().getName());
		row.put("status", project.getStatus());
		row.put("startDate", project.getStartDate());
		row.put("endDate", project.getEndDate());
		return row;
	}

	private record ReportCatalogEntry(
			String id,
			String name,
			String description,
			Instant lastUpdated,
			List<ColumnDefinition> columns) {
	}
}
