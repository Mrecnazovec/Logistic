import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoaderTable } from '@/components/ui/table/TableStates'
import { DeskPage } from './DeskPage'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['desk.meta.title'] ?? 'Desk',
	}
}

export default function page() {
	return (
		<Suspense fallback={<LoaderTable />}>
			<DeskPage />
		</Suspense>
	)
}
