package com.enfos.reporting.report.persistence;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

	@Id
	private String id;

	private String name;

	private String email;

	private String role;

	private String status;

	private Instant createdDate;

	protected User() {
	}

	public User(String id, String name, String email, String role, String status, Instant createdDate) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.role = role;
		this.status = status;
		this.createdDate = createdDate;
	}

	public String getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getEmail() {
		return email;
	}

	public String getRole() {
		return role;
	}

	public String getStatus() {
		return status;
	}

	public Instant getCreatedDate() {
		return createdDate;
	}
}
