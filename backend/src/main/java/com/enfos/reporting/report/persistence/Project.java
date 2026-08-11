package com.enfos.reporting.report.persistence;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "projects")
public class Project {

	@Id
	private String id;

	private String name;

	@ManyToOne(fetch = FetchType.LAZY)
	private Department department;

	@ManyToOne(fetch = FetchType.LAZY)
	private User owner;

	private String status;

	private LocalDate startDate;

	private LocalDate endDate;

	protected Project() {
	}

	public Project(
			String id,
			String name,
			Department department,
			User owner,
			String status,
			LocalDate startDate,
			LocalDate endDate) {
		this.id = id;
		this.name = name;
		this.department = department;
		this.owner = owner;
		this.status = status;
		this.startDate = startDate;
		this.endDate = endDate;
	}

	public String getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public Department getDepartment() {
		return department;
	}

	public User getOwner() {
		return owner;
	}

	public String getStatus() {
		return status;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}
}
