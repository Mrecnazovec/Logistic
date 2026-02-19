import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PostingEditPageSkeleton } from '@/components/ui/skeletons/PostingEditPageSkeleton'
import { PostingPage } from './(PostingPage)'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['announcements.posting.meta.title'] ?? 'Post',
	}
}

export default function Page() {
	const isDevelopmentMapsEnabled = process.env.APP_ENV === 'development'
	const yandexApiKey = isDevelopmentMapsEnabled ? process.env.YANDEX_SECRET_KEY : undefined

	return (
		<Suspense fallback={<PostingEditPageSkeleton />}>
			<PostingPage yandexApiKey={yandexApiKey} showMap={isDevelopmentMapsEnabled} />
		</Suspense>
	)
}
