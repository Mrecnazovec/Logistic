import { Suspense } from 'react'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'
import { RatingPage } from './RatingPage'
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
		title: messages['rating.meta.title'] ?? 'Rating',
	}
}

export default function Page() {
	return (
		<Suspense fallback={<SuspensePageSkeleton variant='dashboard' />}>
			<RatingPage />
		</Suspense>
	)
}

