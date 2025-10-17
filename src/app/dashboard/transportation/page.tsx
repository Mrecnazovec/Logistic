import { Metadata } from 'next'
import { Suspense } from 'react'
import { TransportationPage } from './TransportationPage'

export const metadata: Metadata = {
	title: 'Мои грузы'
}

export default function page() {
	return (
		<Suspense>
			<TransportationPage />
		</Suspense>
	)
}
