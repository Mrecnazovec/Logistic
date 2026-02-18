import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SuspensePageSkeleton } from '@/components/ui/skeletons/SuspensePageSkeleton'
import { AuthPage } from './AuthPage'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	return {
		title: messages['auth.meta.title'] ?? 'Auth',
	}
}

export default function Page() {
	return (
		<Suspense fallback={<SuspensePageSkeleton variant='form' />}>
			<AuthPage />
		</Suspense>
	)
}
