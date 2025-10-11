import { Suspense } from 'react'
import { TransportationPage } from './TransportationPage'

export default function page() {
	return (
		<Suspense>
			<TransportationPage />
		</Suspense>
	)
}
