import type { ReportDetail, ReportId, ReportSummary } from './types'

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, { signal })

  if (!response.ok) {
    throw new ApiError(`Request failed (${response.status})`, response.status)
  }

  return response.json() as Promise<T>
}

export function fetchReports(signal?: AbortSignal): Promise<ReportSummary[]> {
  return getJson<ReportSummary[]>('/api/reports', signal)
}

export function fetchReport(id: ReportId, signal?: AbortSignal): Promise<ReportDetail> {
  return getJson<ReportDetail>(`/api/reports/${id}`, signal)
}
