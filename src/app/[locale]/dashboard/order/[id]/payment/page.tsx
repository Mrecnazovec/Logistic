import { Suspense } from 'react'
import { PaymentPage } from './(PaymentPage)/PaymentPage'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'
import { PaymentPageSkeleton } from './(PaymentPage)/ui/PaymentPageSkeleton'

type PageProps = {
	params: Promise<{ locale: string }>
}

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const locale = await getLocale(params)
	const messages = getMessages(locale)
	return {
		title: messages['order.payment.meta.title'] ?? 'Payment',
	}
}

export default function Page() {
	return (
		<Suspense fallback={<PaymentPageSkeleton />}>
			<PaymentPage />
		</Suspense>
	)
}

