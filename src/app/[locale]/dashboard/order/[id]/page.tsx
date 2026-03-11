import { Suspense } from 'react'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'
import { OrderPage } from './(OrderPage)/OrderPage'
import { OrderPageSkeleton } from './(OrderPage)/ui/OrderPageSkeleton'

type PageProps = {
	params: Promise<{ locale: string }>
}

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const locale = await getLocale(params)
	const messages = getMessages(locale)
	return {
		title: messages['order.meta.title'] ?? 'Order',
	}
}

export default function Page() {
	return (
		<Suspense fallback={<OrderPageSkeleton />}>
			<OrderPage />
		</Suspense>
	)
}


