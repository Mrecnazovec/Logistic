import { Suspense } from 'react'
import { SharedOrderPage } from './(SharedOrderPage)/SharedOrderPage'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'
import { SharedOrderPageSkeleton } from './(SharedOrderPage)/ui/SharedOrderPageSkeleton'

type PageProps = {
	params: Promise<{ locale: string }>
}

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const locale = await getLocale(params)
	const messages = getMessages(locale)
	return {
		title: messages['order.shared.meta.title'] ?? 'Order view',
	}
}

export default function Page() {
	return (
		<Suspense fallback={<SharedOrderPageSkeleton />}>
			<SharedOrderPage />
		</Suspense>
	)
}

