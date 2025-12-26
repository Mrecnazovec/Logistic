import { Suspense } from 'react'
import type { Metadata } from 'next'
import { AnnouncementsPage } from './AnnouncementsPage'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['announcements.meta.title'] ?? 'Announcements',
	}
}

export default function page() {
	return (
		<Suspense>
			<AnnouncementsPage />
		</Suspense>
	)
}
