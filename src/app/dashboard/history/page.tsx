import { Suspense } from 'react'
import { HistoryPage } from './HistoryPage'
import { LoaderTable } from '@/components/ui/table/TableStates'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['history.meta.title'] ?? 'History',
	}
}

export default function page() {
	return (
		<Suspense fallback={<LoaderTable />}>
			<HistoryPage />
		</Suspense>
	)
}
