import { AgreementPage } from './AgreementPage'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['order.agreement.meta.title'] ?? 'Agreement',
	}
}

export default function page() {
	return <AgreementPage />
}
