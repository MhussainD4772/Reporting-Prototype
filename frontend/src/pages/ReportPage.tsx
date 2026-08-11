import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import type { ReportRow } from '../api/types'
import { isReportId } from '../api/types'
import DataTable from '../components/DataTable'
import ErrorPanel from '../components/ErrorPanel'
import SearchField from '../components/SearchField'
import { useReport } from '../hooks/useReport'

function rowMatches(row: ReportRow, needle: string): boolean {
	return Object.values(row).some(
		(value) => value !== null && String(value).toLowerCase().includes(needle),
	)
}

export default function ReportPage() {
	const { id: rawId } = useParams()
	const id = isReportId(rawId) ? rawId : null
	const { state, retry } = useReport(id)
	const [query, setQuery] = useState('')

	const filteredRows = useMemo(() => {
		if (state.status !== 'ok') {
			return []
		}
		const needle = query.trim().toLowerCase()
		if (!needle) {
			return state.report.rows
		}
		return state.report.rows.filter((row) => rowMatches(row, needle))
	}, [query, state])

	const totalRows = state.status === 'ok' ? state.report.rows.length : 0

	return (
		<main className="mx-auto flex h-[calc(100dvh-4.25rem)] max-w-[1280px] flex-col px-4 py-8">
			<Link
				to="/"
				className="inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-accent"
			>
				← All reports
			</Link>

			{!id && (
				<div className="mt-6">
					<h1 className="text-3xl font-medium tracking-tight">Report not found</h1>
					<p className="mt-2 text-muted">That report id is not in this portal.</p>
				</div>
			)}

			{id && state.status === 'loading' && (
				<div className="mt-6">
					<div className="h-8 w-48 animate-pulse rounded-lg bg-surface" />
					<div className="mt-3 h-4 w-72 animate-pulse rounded-lg bg-surface" />
					<div className="mt-6 h-80 animate-pulse rounded-xl border border-border bg-surface" />
				</div>
			)}

			{id && state.status === 'error' && (
				<div className="mt-6">
					<ErrorPanel message={state.message} onRetry={retry} />
				</div>
			)}

			{id && state.status === 'ok' && (
				<>
					<header className="mt-4 flex shrink-0 flex-wrap items-end justify-between gap-4">
						<div>
							<h1 className="text-3xl font-medium tracking-tight">{state.report.name}</h1>
							<p className="mt-2 text-muted">{state.report.description}</p>
						</div>
						<p className="rounded-full border border-border bg-surface px-3 py-1 text-sm tabular-nums text-muted">
							{query.trim()
								? `${filteredRows.length} of ${totalRows} rows`
								: `${totalRows} ${totalRows === 1 ? 'row' : 'rows'}`}
						</p>
					</header>

					{totalRows > 0 && (
						<div className="mt-6 shrink-0">
							<SearchField
								label="Search rows"
								placeholder="Search this report"
								value={query}
								onChange={setQuery}
							/>
						</div>
					)}

					<div className="mt-6 min-h-0 flex-1">
						{totalRows === 0 ? (
							<p className="rounded-xl border border-border bg-surface px-5 py-10 text-center text-muted">
								No rows in this report.
							</p>
						) : filteredRows.length === 0 ? (
							<div className="rounded-xl border border-border bg-surface px-5 py-10 text-center">
								<p className="text-muted">No rows match “{query.trim()}”.</p>
								<button
									type="button"
									onClick={() => setQuery('')}
									className="mt-3 min-h-9 cursor-pointer rounded-lg bg-accent px-3 text-sm font-medium text-canvas active:translate-y-px"
								>
									Clear search
								</button>
							</div>
						) : (
							<DataTable columns={state.report.columns} rows={filteredRows} />
						)}
					</div>
				</>
			)}
		</main>
	)
}
