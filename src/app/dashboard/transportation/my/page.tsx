import { Metadata } from 'next'
import { Suspense } from 'react'
import { TransportationMyPage } from './TransportationMyPage'

export const metadata: Metadata = {
	title: 'Мои грузы'
}

export default function page() {
	return (
		<Suspense>
			<TransportationMyPage />
		</Suspense>
	)
}
