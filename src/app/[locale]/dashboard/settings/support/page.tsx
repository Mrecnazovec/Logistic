import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'
import { SupportPage } from './SupportPage'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['settings.support.meta.title'] ?? 'Support',
	}
}

export default function Page() {
	return <SupportPage />
}
