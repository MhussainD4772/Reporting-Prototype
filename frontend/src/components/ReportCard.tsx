import { Link } from 'react-router-dom'

import type { ReportId, ReportSummary } from '../api/types'

type ReportCardProps = {
	report: ReportSummary
}

const MARK: Record<ReportId, { letter: string; bar: string; chip: string }> = {
	users: {
		letter: 'U',
		bar: 'bg-accent',
		chip: 'bg-accent-soft text-accent',
	},
	departments: {
		letter: 'D',
		bar: 'bg-sky',
		chip: 'bg-sky-soft text-sky',
	},
	projects: {
		letter: 'P',
		bar: 'bg-violet',
		chip: 'bg-violet-soft text-violet',
	},
}

function formatUpdated(iso: string): string {
	const date = new Date(iso)
	const days = Math.floor((Date.now() - date.getTime()) / 86_400_000)

	if (days < 1) {
		return 'Updated today'
	}
	if (days === 1) {
		return 'Updated yesterday'
	}
	if (days < 30) {
		return `Updated ${days} days ago`
	}

	return `Updated ${date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})}`
}

export default function ReportCard({ report }: ReportCardProps) {
	const mark = MARK[report.id]

	return (
		<Link
			to={`/reports/${report.id}`}
			className="group relative block overflow-hidden rounded-xl border border-border bg-surface transition duration-150 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-raised"
		>
			<span className={`absolute inset-y-0 left-0 w-1 ${mark.bar}`} aria-hidden="true" />
			<div className="flex min-h-[168px] flex-col p-5 pl-6">
				<div className="flex items-start justify-between gap-3">
					<span
						className={`grid h-9 w-9 place-items-center rounded-lg text-sm font-semibold ${mark.chip}`}
					>
						{mark.letter}
					</span>
					<span className="text-sm text-muted transition-colors group-hover:text-accent">
						Open →
					</span>
				</div>
				<h2 className="mt-4 text-lg font-medium tracking-tight">{report.name}</h2>
				<p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{report.description}</p>
				<p className="mt-4 text-xs tabular-nums text-muted">{formatUpdated(report.lastUpdated)}</p>
			</div>
		</Link>
	)
}
