import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'
import { SettingPage } from './SettingPage'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['settings.meta.title'] ?? 'Settings',
	}
}

export default function Page() {
	return <SettingPage />
}
