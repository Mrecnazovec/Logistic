import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SuspensePageSkeleton } from '@/components/ui/skeletons/SuspensePageSkeleton'
import { EditPage } from './(EditPage)'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['desk.edit.meta.title'] ?? 'Edit',
	}
}

export default function Page() {
	const isDevelopmentMapsEnabled = process.env.APP_ENV === 'development'
	const yandexApiKey = isDevelopmentMapsEnabled ? process.env.YANDEX_SECRET_KEY : undefined

	return (
		<Suspense fallback={<SuspensePageSkeleton variant='form' />}>
			<EditPage yandexApiKey={yandexApiKey} showMap={isDevelopmentMapsEnabled} />
		</Suspense>
	)
}
