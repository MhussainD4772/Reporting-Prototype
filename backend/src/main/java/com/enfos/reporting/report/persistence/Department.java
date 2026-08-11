package com.enfos.reporting.report.persistence;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "departments")
public class Department {

	@Id
	private String id;

	private String name;

	@ManyToOne(fetch = FetchType.LAZY)
	private User manager;

	private int employeeCount;

	private String location;

	protected Department() {
	}

	public Department(String id, String name, User manager, int employeeCount, String location) {
		this.id = id;
		this.name = name;
		this.manager = manager;
		this.employeeCount = employeeCount;
		this.location = location;
	}

	public String getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public User getManager() {
		return manager;
	}

	public int getEmployeeCount() {
		return employeeCount;
	}

	public String getLocation() {
		return location;
	}
}
