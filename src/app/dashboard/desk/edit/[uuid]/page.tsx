import type { Metadata } from 'next'
import { Suspense } from 'react'
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

export default function page() {
	const yandexApiKey = process.env.YANDEX_SECRET_KEY

	return (
		<Suspense fallback={null}>
			<EditPage yandexApiKey={yandexApiKey} />
		</Suspense>
	)
}
