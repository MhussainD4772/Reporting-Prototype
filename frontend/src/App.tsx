import { Link, Route, Routes } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import ReportPage from './pages/ReportPage'

export default function App() {
	return (
		<div className="min-h-svh text-ink">
			<header className="sticky top-0 z-30 border-b border-border/80 bg-canvas/80 backdrop-blur-md">
				<div className="mx-auto flex max-w-[1120px] items-center gap-3 px-4 py-3">
					<Link to="/" className="flex min-h-11 items-center gap-2.5">
						<span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-xs font-semibold text-canvas">
							R
						</span>
						<span className="text-sm font-medium tracking-tight text-muted">
							Reporting Tool
						</span>
					</Link>
				</div>
			</header>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/reports/:id" element={<ReportPage />} />
			</Routes>
		</div>
	)
}
