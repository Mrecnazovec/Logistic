import type { Metadata } from 'next'
import { Cabinet } from './(Cabinet)'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['cabinet.meta.title'] ?? 'Cabinet',
	}
}

export default function Page() {
	return <Cabinet />
}
