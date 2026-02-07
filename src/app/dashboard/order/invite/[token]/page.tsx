import { InvitePage } from './(InvitePage)'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['order.invite.meta.title'] ?? 'Order invitation',
	}
}

export default function Page() {
	return <InvitePage />
}
