import { useCallback, useEffect, useState } from 'react';

import { ApiError, fetchReport } from '../api/client';
import type { ReportDetail, ReportId } from '../api/types';

type ReportState =
	| { status: 'loading' }
	| { status: 'error'; message: string }
	| { status: 'ok'; report: ReportDetail }

export function useReport(id: ReportId | null) {
	const [state, setState] = useState<ReportState>({ status: 'loading' })
	const [requestId, setRequestId] = useState(0)

	const retry = useCallback(() => {
		setRequestId((n) => n + 1)
	}, [])

	useEffect(() => {
		if (!id) {
			return
		}

		const controller = new AbortController()
		setState({ status: 'loading' })

		fetchReport(id, controller.signal)
			.then((report) => {
				setState({ status: 'ok', report })
			})
			.catch((error: unknown) => {
				if (controller.signal.aborted) {
					return
				}
				const message =
					error instanceof ApiError
						? 'Could not load this report. Check that the API is running, then try again.'
						: 'Could not load this report. Try again.'
				setState({ status: 'error', message })
			})

		return () => controller.abort()
	}, [id, requestId])

	return { state, retry }
}
