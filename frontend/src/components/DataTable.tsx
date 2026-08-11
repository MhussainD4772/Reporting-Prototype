import { useMemo, useState } from 'react'

import type { ColumnDefinition, ReportRow } from '../api/types'
import StatusPill from './StatusPill'

type DataTableProps = {
	columns: ColumnDefinition[]
	rows: ReportRow[]
}

type Sort = {
	key: string
	direction: 'asc' | 'desc'
}

function formatDate(value: string): string {
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		const [year, month, day] = value.split('-').map(Number)
		return new Date(year, month - 1, day).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		})
	}

	return new Date(value).toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	})
}

function formatCell(column: ColumnDefinition, raw: ReportRow[string]): string {
	if (raw === null || raw === undefined || raw === '') {
		return '—'
	}
	if (column.type === 'date' || column.type === 'datetime') {
		return formatDate(String(raw))
	}
	return String(raw)
}

function compare(a: ReportRow[string], b: ReportRow[string]): number {
	if (a === null || a === undefined) {
		return 1
	}
	if (b === null || b === undefined) {
		return -1
	}
	if (typeof a === 'number' && typeof b === 'number') {
		return a - b
	}
	return String(a).localeCompare(String(b), undefined, { numeric: true })
}

export default function DataTable({ columns, rows }: DataTableProps) {
	const [sort, setSort] = useState<Sort | null>(null)

	const sortedRows = useMemo(() => {
		if (!sort) {
			return rows
		}
		return [...rows].sort((left, right) => {
			const result = compare(left[sort.key], right[sort.key])
			return sort.direction === 'asc' ? result : -result
		})
	}, [rows, sort])

	function toggleSort(key: string) {
		setSort((current) => {
			if (current?.key !== key) {
				return { key, direction: 'asc' }
			}
			return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
		})
	}

	return (
		<div className="table-scroll h-full overflow-auto rounded-xl border border-border bg-surface">
			<table className="min-w-[720px] w-full border-separate border-spacing-0 text-sm">
				<thead>
					<tr>
						{columns.map((column, index) => {
							const numeric = column.type === 'number'
							const active = sort?.key === column.key
							const first = index === 0
							return (
								<th
									key={column.key}
									scope="col"
									className={`sticky top-0 h-11 border-b border-border bg-raised px-4 text-xs font-medium tracking-wide whitespace-nowrap text-muted uppercase ${numeric ? 'text-right' : 'text-left'} ${first ? 'left-0 z-30 border-r border-border shadow-[8px_0_8px_-6px_rgba(0,0,0,0.65)]' : 'z-20'}`}
								>
									<button
										type="button"
										onClick={() => toggleSort(column.key)}
										className="inline-flex min-h-11 items-center gap-1"
									>
										{column.label}
										{active && (
											<span className="text-accent" aria-hidden="true">
												{sort.direction === 'asc' ? '↑' : '↓'}
											</span>
										)}
									</button>
								</th>
							)
						})}
					</tr>
				</thead>
				<tbody>
					{sortedRows.map((row, rowIndex) => (
						<tr
							key={String(row[columns[0]?.key] ?? rowIndex)}
							className="group border-b border-border/80 last:border-b-0 hover:bg-white/[0.03]"
						>
							{columns.map((column, index) => {
								const numeric = column.type === 'number'
								const raw = row[column.key]
								return (
									<td
										key={column.key}
										className={`h-12 px-4 tabular-nums whitespace-nowrap ${numeric ? 'text-right' : 'text-left'} ${index === 0 ? 'sticky left-0 z-10 border-r border-border bg-surface font-medium shadow-[8px_0_8px_-6px_rgba(0,0,0,0.65)] group-hover:bg-[#1a1a17]' : ''}`}
									>
										{column.key === 'status' && typeof raw === 'string' ? (
											<StatusPill value={raw} />
										) : (
											formatCell(column, raw)
										)}
									</td>
								)
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
