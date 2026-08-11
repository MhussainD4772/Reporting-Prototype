import { useMemo, useState } from 'react'

import ErrorPanel from '../components/ErrorPanel'
import ReportCard from '../components/ReportCard'
import SearchField from '../components/SearchField'
import { useReports } from '../hooks/useReports'

export default function LandingPage() {
	const { state, retry } = useReports()
	const [query, setQuery] = useState('')

	const filtered = useMemo(() => {
		if (state.status !== 'ok') {
			return []
		}
		const needle = query.trim().toLowerCase()
		if (!needle) {
			return state.reports
		}
		return state.reports.filter((report) => report.name.toLowerCase().includes(needle))
	}, [query, state])

	return (
		<main className="mx-auto max-w-[1120px] px-4 py-10 sm:py-14">
			<p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">Internal portal</p>
			<h1 className="mt-3 max-w-xl text-3xl font-medium tracking-tight sm:text-4xl">
				Find a report. Open it. Read the data.
			</h1>
			<p className="mt-3 max-w-lg text-muted">
				Users, departments, and projects.
			</p>

			<div className="mt-8">
				<SearchField
					label="Search reports"
					placeholder="Search reports by name"
					value={query}
					onChange={setQuery}
				/>
			</div>

			{state.status === 'loading' && (
				<ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{[0, 1, 2].map((key) => (
						<li
							key={key}
							className="h-[168px] animate-pulse rounded-xl border border-border bg-surface"
						/>
					))}
				</ul>
			)}

			{state.status === 'error' && (
				<div className="mt-8">
					<ErrorPanel message={state.message} onRetry={retry} />
				</div>
			)}

			{state.status === 'ok' && state.reports.length === 0 && (
				<p className="mt-8 text-muted">No reports are available.</p>
			)}

			{state.status === 'ok' && state.reports.length > 0 && filtered.length === 0 && (
				<p className="mt-8 text-muted">No reports match “{query.trim()}”.</p>
			)}

			{state.status === 'ok' && filtered.length > 0 && (
				<ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((report) => (
						<li key={report.id}>
							<ReportCard report={report} />
						</li>
					))}
				</ul>
			)}
		</main>
	)
}
