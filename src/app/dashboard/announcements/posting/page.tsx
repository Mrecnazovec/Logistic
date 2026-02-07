import { Suspense } from 'react'
import type { Metadata } from 'next'
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

export default function page() {
	const yandexApiKey = process.env.YANDEX_SECRET_KEY

	return (
		<Suspense fallback={null}>
			<PostingPage yandexApiKey={yandexApiKey} />
		</Suspense>
	)
}
