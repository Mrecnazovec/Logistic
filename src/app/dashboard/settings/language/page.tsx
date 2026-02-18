import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'
import { LanguagePage } from './LanguagePage'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['settings.language.title'] ?? 'Language',
	}
}

export default function Page() {
	return <LanguagePage />
}
