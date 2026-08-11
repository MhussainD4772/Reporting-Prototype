package com.enfos.reporting.report.web;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record ReportDetail(
		String id,
		String name,
		String description,
		Instant lastUpdated,
		List<ColumnDefinition> columns,
		List<Map<String, Object>> rows
) {
}
