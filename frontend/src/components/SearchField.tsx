type SearchFieldProps = {
	value: string
	onChange: (value: string) => void
	placeholder: string
	label: string
}

export default function SearchField({ value, onChange, placeholder, label }: SearchFieldProps) {
	return (
		<label className="relative block">
			<span className="sr-only">{label}</span>
			<svg
				className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted"
				viewBox="0 0 16 16"
				fill="none"
				aria-hidden="true"
			>
				<circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
				<path d="M11 11.5 14 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			</svg>
			<input
				type="search"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				className="h-12 w-full rounded-xl border border-border bg-surface pr-4 pl-10 text-ink placeholder:text-muted"
			/>
		</label>
	)
}
