import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Dashboard } from './Dashboard'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import { SuspensePageSkeleton } from '@/components/ui/skeletons/SuspensePageSkeleton'

type PageProps = {
	params: Promise<{ locale: string }>
}

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const locale = await getLocale(params)
	const messages = getMessages(locale)
	return {
		title: messages['components.dashboard.nav.home'] ?? 'Homepage',
	}
}

export default function Page() {
	return (
		<Suspense fallback={<SuspensePageSkeleton variant='dashboard' />}>
			<Dashboard />
		</Suspense>
	)
}

