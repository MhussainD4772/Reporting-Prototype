export type ColumnType = "string" | "number" | "date" | "datetime";

export type ColumnDefinition = {
  key: string;
  label: string;
  type: ColumnType;
};

export type ReportId = "users" | "departments" | "projects";

const REPORT_IDS: ReportId[] = ["users", "departments", "projects"];

export function isReportId(value: string | undefined): value is ReportId {
	return value !== undefined && REPORT_IDS.includes(value as ReportId);
}

export type ReportSummary = {
  id: ReportId;
  name: string;
  description: string;
  lastUpdated: string;
};

export type ReportRow = Record<string, string | number | boolean | null>;

export type ReportDetail = {
  id: ReportId;
  name: string;
  description: string;
  lastUpdated: string;
  columns: ColumnDefinition[];
  rows: ReportRow[];
};
