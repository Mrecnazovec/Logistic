import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SuspensePageSkeleton } from '@/components/ui/skeletons/SuspensePageSkeleton'
import { AnnouncementsPage } from './AnnouncementsPage'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'

type PageProps = {
	params: Promise<{ locale: string }>
}

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const locale = await getLocale(params)
	const messages = getMessages(locale)
	return {
		title: messages['announcements.meta.title'] ?? 'Announcements',
	}
}

export default function Page() {
	return (
		<Suspense fallback={<SuspensePageSkeleton variant='dashboard' />}>
			<AnnouncementsPage />
		</Suspense>
	)
}

