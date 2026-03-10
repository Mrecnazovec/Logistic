import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SuspensePageSkeleton } from '@/components/ui/skeletons/SuspensePageSkeleton'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import { TransportationMyPage } from './TransportationMyPage'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['transportation.meta.title'] ?? 'Transportation',
	}
}

export default function Page() {
	return (
		<Suspense fallback={<SuspensePageSkeleton variant='dashboard' />}>
			<TransportationMyPage />
		</Suspense>
	)
}
