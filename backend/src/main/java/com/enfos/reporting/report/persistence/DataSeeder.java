package com.enfos.reporting.report.persistence;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataSeeder implements ApplicationRunner {

	private static final String[] USER_NAMES = {
			"Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Margaret Hamilton",
			"Linus Torvalds", "Radia Perlman", "Donald Knuth", "Barbara Liskov", "Edsger Dijkstra",
			"Tim Berners-Lee", "Vint Cerf", "Jean Bartik", "John von Neumann", "Frances Allen",
			"Ken Thompson", "Dennis Ritchie", "Adele Goldberg", "Bjarne Stroustrup", "Guido van Rossum",
			"Brendan Eich", "James Gosling", "Anita Borg", "Shafi Goldwasser", "Fei-Fei Li"
	};

	private static final String[] ROLES = { "Admin", "Manager", "Engineer", "Analyst" };
	private static final String[] USER_STATUSES = { "Active", "Active", "Active", "Inactive" };

	private static final String[] DEPARTMENT_NAMES = {
			"Engineering", "Product", "Operations", "Design",
			"Finance", "Marketing", "Sales", "Support"
	};

	private static final int[] DEPARTMENT_SIZES = { 4, 4, 3, 3, 3, 3, 3, 2 };

	private static final String[] LOCATIONS = {
			"Remote", "New York", "Austin", "London", "Toronto"
	};

	private static final String[] PROJECT_NAMES = {
			"Reporting Portal", "Billing Pipeline", "Customer Onboarding", "Warehouse Audit",
			"Mobile Field App", "Identity Service", "Data Lake", "Support Desk"
	};

	private static final String[] PROJECT_STATUSES = { "Active", "Active", "Completed", "On Hold" };

	private final UserRepository userRepository;
	private final DepartmentRepository departmentRepository;
	private final ProjectRepository projectRepository;

	public DataSeeder(
			UserRepository userRepository,
			DepartmentRepository departmentRepository,
			ProjectRepository projectRepository) {
		this.userRepository = userRepository;
		this.departmentRepository = departmentRepository;
		this.projectRepository = projectRepository;
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		if (userRepository.count() > 0) {
			return;
		}

		List<User> users = new ArrayList<>();
		for (int i = 0; i < 25; i++) {
			String name = USER_NAMES[i];
			String email = name.toLowerCase().replace(" ", ".").replace("-", ".") + "@enfos.example";
			users.add(userRepository.save(new User(
					"U-%d".formatted(1001 + i),
					name,
					email,
					ROLES[i % ROLES.length],
					USER_STATUSES[i % USER_STATUSES.length],
					Instant.parse("2024-01-01T09:00:00Z").plusSeconds(i * 86400L))));
		}

		List<Department> departments = new ArrayList<>();
		for (int i = 0; i < 8; i++) {
			departments.add(departmentRepository.save(new Department(
					"D-%d".formatted(10 + i),
					DEPARTMENT_NAMES[i],
					users.get(i),
					DEPARTMENT_SIZES[i],
					LOCATIONS[i % LOCATIONS.length])));
		}

		for (int i = 0; i < 8; i++) {
			boolean completed = "Completed".equals(PROJECT_STATUSES[i % PROJECT_STATUSES.length]);
			LocalDate start = LocalDate.of(2025, 1, 15).plusMonths(i);
			projectRepository.save(new Project(
					"P-%d".formatted(501 + i),
					PROJECT_NAMES[i],
					departments.get(i),
					users.get((i * 3) % users.size()),
					PROJECT_STATUSES[i % PROJECT_STATUSES.length],
					start,
					completed ? start.plusMonths(6) : null));
		}
	}
}
