import { Metadata } from 'next'
import { Suspense } from 'react'
import { DeskMyPage } from './DeskMyPage'

export const metadata: Metadata = {
	title: 'Заявки'
}

export default function page() {
	return (
		<Suspense>
			<DeskMyPage />
		</Suspense>
	)
}
