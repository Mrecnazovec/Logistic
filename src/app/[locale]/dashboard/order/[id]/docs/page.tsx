import { Suspense } from 'react'
import { DocsPage } from './DocsPage'
import { DocsPageSkeleton } from './DocsPageSkeleton'
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
		title: messages['order.docs.meta.title'] ?? 'Documents',
	}
}

export default function Page() {
	return (
		<Suspense fallback={<DocsPageSkeleton />}>
			<DocsPage />
		</Suspense>
	)
}

