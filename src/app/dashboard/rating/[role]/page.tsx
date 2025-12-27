import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'
import { RatingPage } from '../RatingPage'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['rating.meta.title'] ?? 'Rating',
	}
}

export default function page() {
	return <RatingPage />
}
