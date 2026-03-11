import { Suspense } from 'react'
import { Notifications } from './(Notifications)/Notifications'
import { SuspensePageSkeleton } from '@/components/ui/skeletons/SuspensePageSkeleton'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'

type PageProps = {
	params: Promise<{ locale: string }>
}

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const locale = await getLocale(params)
	const messages = getMessages(locale)
	return {
		title: messages['notifications.meta.title'] ?? 'Notifications',
	}
}

export default function Page() {
	return (
		<Suspense fallback={<SuspensePageSkeleton variant='dashboard' />}>
			<Notifications />
		</Suspense>
	)
}

