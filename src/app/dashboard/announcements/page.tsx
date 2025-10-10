import { Suspense } from 'react'
import { AnnouncementsPage } from './AnnouncementsPage'

export default function page() {
	return (
		<Suspense>
			<AnnouncementsPage />
		</Suspense>
	)
}
