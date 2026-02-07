import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DeskMyPage } from './(DeskMyPage)'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['deskMy.meta.title'] ?? 'Desk',
	}
}

export default function page() {
	return (
		<Suspense>
			<DeskMyPage />
		</Suspense>
	)
}
