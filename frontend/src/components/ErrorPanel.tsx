type ErrorPanelProps = {
	message: string
	onRetry: () => void
}

export default function ErrorPanel({ message, onRetry }: ErrorPanelProps) {
	return (
		<div className="rounded-xl border border-border bg-surface p-6">
			<p className="text-ink">{message}</p>
			<button
				type="button"
				onClick={onRetry}
				className="mt-4 min-h-11 rounded-lg bg-accent px-4 text-sm font-medium text-canvas"
			>
				Retry
			</button>
		</div>
	)
}
