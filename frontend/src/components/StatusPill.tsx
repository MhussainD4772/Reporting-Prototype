const STYLES: Record<string, string> = {
	Active: 'bg-accent-soft text-accent',
	Inactive: 'bg-done-soft text-done',
	'On Hold': 'bg-hold-soft text-hold',
	Completed: 'bg-done-soft text-done',
}

type StatusPillProps = {
	value: string
}

export default function StatusPill({ value }: StatusPillProps) {
	const style = STYLES[value] ?? 'bg-done-soft text-done'

	return (
		<span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
			{value}
		</span>
	)
}
