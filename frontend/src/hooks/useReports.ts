import { useCallback, useEffect, useState } from 'react';

import { ApiError, fetchReports } from '../api/client';
import type { ReportSummary } from '../api/types';

type ReportsState =
	| { status: 'loading' }
	| { status: 'error'; message: string }
	| { status: 'ok'; reports: ReportSummary[] }

export function useReports() {
	const [state, setState] = useState<ReportsState>({ status: 'loading' })
	const [requestId, setRequestId] = useState(0)

	const retry = useCallback(() => {
		setRequestId((id) => id + 1)
	}, [])

	useEffect(() => {
		const controller = new AbortController()
		setState({ status: 'loading' })

		fetchReports(controller.signal)
			.then((reports) => {
				setState({ status: 'ok', reports })
			})
			.catch((error: unknown) => {
				if (controller.signal.aborted) {
					return
				}
				const message =
					error instanceof ApiError
						? 'Could not load reports. Check that the API is running, then try again.'
						: 'Could not load reports. Try again.'
				setState({ status: 'error', message })
			})

		return () => controller.abort()
	}, [requestId])

	return { state, retry }
}
