package com.enfos.reporting.report.web;

import java.time.Instant;

public record ReportSummary(
		String id,
		String name,
		String description,
		Instant lastUpdated
) {
}
