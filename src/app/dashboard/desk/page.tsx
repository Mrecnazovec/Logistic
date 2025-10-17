import { Metadata } from 'next'
import { Suspense } from 'react'
import { DeskPage } from './DeskPage'

export const metadata: Metadata = {
	title: 'Заявки'
}

export default function page() {
	return (
		<Suspense>
			<DeskPage />
		</Suspense>
	)
}
