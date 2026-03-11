import { Suspense } from 'react'
import { AgreementPage } from './(AgreementPage)/AgreementPage'
import { SuspensePageSkeleton } from '@/components/ui/skeletons/SuspensePageSkeleton'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'

type PageProps = {
	params: Promise<{ locale: string }>
}

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const locale = await getLocale(params)
	const messages = getMessages(locale)
	return {
		title: messages['order.agreement.meta.title'] ?? 'Agreement',
	}
}

export default function Page() {
	return (
		<Suspense fallback={<SuspensePageSkeleton variant='detail' />}>
			<AgreementPage />
		</Suspense>
	)
}

