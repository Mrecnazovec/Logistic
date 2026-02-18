import { SharedOrderPage } from './(SharedOrderPage)'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['order.shared.meta.title'] ?? 'Order view',
	}
}

export default function Page() {
	return <SharedOrderPage />
}
