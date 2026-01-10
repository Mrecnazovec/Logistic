import { Metadata } from 'next'
import { Dashboard } from './Dashboard'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['components.dashboard.nav.home'] ?? 'Homepage',
	}
}

export default function page() {
	return <Dashboard />
}
