import { Suspense } from 'react'
import { StatusPage } from './StatusPage'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'
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
		title: messages['order.shared.status.meta.title'] ?? 'Order status view',
	}
}

export default function Page() {
	return (
		<Suspense fallback={<SuspensePageSkeleton variant='detail' />}>
			<StatusPage />
		</Suspense>
	)
}

