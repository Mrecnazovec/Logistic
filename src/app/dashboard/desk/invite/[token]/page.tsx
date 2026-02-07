import type { Metadata } from 'next'
import { InvitePage } from './(InvitePage)'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['desk.invite.meta.title'] ?? 'Invite',
	}
}

export default function Page() {
	return <InvitePage />
}
