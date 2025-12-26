import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'
import { PasswordPage } from './PasswordPage'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['settings.password.meta.title'] ?? 'Change password',
	}
}

export default function page() {
	return <PasswordPage />
}
