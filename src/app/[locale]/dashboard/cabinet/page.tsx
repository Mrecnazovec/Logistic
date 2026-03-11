import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Cabinet } from './(Cabinet)/Cabinet'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import { SuspensePageSkeleton } from '@/components/ui/skeletons/SuspensePageSkeleton'

type PageProps = {
	params: Promise<{ locale: string }>
}

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const locale = await getLocale(params)
	const messages = getMessages(locale)
	return {
		title: messages['cabinet.meta.title'] ?? 'Cabinet',
	}
}

export default function Page() {
	return (
		<Suspense fallback={<SuspensePageSkeleton variant='detail' />}>
			<Cabinet />
		</Suspense>
	)
}

