package com.enfos.reporting.report.web;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.enfos.reporting.report.service.ReportsService;

@RestController
public class ReportsController {

	private final ReportsService reportsService;

	public ReportsController(ReportsService reportsService) {
		this.reportsService = reportsService;
	}

	@GetMapping("/api/reports")
	public List<ReportSummary> listReports() {
		return reportsService.listReports();
	}

	@GetMapping("/api/reports/users")
	public ReportDetail usersReport() {
		return reportsService.getReport("users");
	}

	@GetMapping("/api/reports/departments")
	public ReportDetail departmentsReport() {
		return reportsService.getReport("departments");
	}

	@GetMapping("/api/reports/projects")
	public ReportDetail projectsReport() {
		return reportsService.getReport("projects");
	}
}
