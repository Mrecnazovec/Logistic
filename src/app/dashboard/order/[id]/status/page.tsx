import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { StatusPage } from './(StatusPage)'
import { StatusPageSkeleton } from './(StatusPage)/ui/StatusPageSkeleton'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['order.status.meta.title'] ?? 'Status',
	}
}

export default function Page() {
	const isDevelopmentMapsEnabled = process.env.APP_ENV === 'development'
	const yandexApiKey = isDevelopmentMapsEnabled ? process.env.YANDEX_SECRET_KEY : undefined

	return (
		<Suspense fallback={<StatusPageSkeleton />}>
			<StatusPage yandexApiKey={yandexApiKey} showMap={isDevelopmentMapsEnabled} />
		</Suspense>
	)
}
