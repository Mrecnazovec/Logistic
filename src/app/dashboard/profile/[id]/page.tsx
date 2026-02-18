import { Suspense } from 'react'

import { SuspensePageSkeleton } from '@/components/ui/skeletons/SuspensePageSkeleton'
import { IdProfile } from './(IdProfile)'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['profile.meta.title'] ?? 'Profile',
	}
}

export default function Page() {
	return (
		<Suspense fallback={<SuspensePageSkeleton variant='detail' />}>
			<IdProfile />
		</Suspense>
	)
}
