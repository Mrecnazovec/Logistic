import { Suspense } from 'react'
import { DeskPage } from './DeskPage'

export default function page() {
	return (
		<Suspense>
			<DeskPage />
		</Suspense>
	)
}
