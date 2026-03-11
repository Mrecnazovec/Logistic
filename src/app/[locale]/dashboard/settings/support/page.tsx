import { Suspense } from 'react'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'
import { SupportPage } from './SupportPage'
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
		title: messages['settings.support.meta.title'] ?? 'Support',
	}
}

export default function Page() {
	return (
		<Suspense fallback={<SuspensePageSkeleton variant='detail' />}>
			<SupportPage />
		</Suspense>
	)
}

