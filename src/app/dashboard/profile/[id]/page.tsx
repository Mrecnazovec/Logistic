import { Suspense } from 'react'

import { LoaderTable } from '@/components/ui/table/TableStates'
import { IdProfile } from './IdProfile'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['profile.meta.title'] ?? 'Profile',
	}
}

export default function page() {
	return (
		<Suspense fallback={<LoaderTable />}>
			<IdProfile />
		</Suspense>
	)
}
