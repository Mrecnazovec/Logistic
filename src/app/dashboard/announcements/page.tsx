import { Metadata } from 'next'
import { Suspense } from 'react'
import { AnnouncementsPage } from './AnnouncementsPage'

export const metadata: Metadata = {
	title: 'Доска объявлений',
}

export default function page() {
	return (
		<Suspense>
			<AnnouncementsPage />
		</Suspense>
	)
}
