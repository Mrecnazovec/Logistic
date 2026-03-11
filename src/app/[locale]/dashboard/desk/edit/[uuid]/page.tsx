import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PostingEditPageSkeleton } from '@/components/ui/skeletons/PostingEditPageSkeleton'
import { EditPage } from './(EditPage)/EditPage'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'

type PageProps = {
	params: Promise<{ locale: string }>
}

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const locale = await getLocale(params)
	const messages = getMessages(locale)
	return {
		title: messages['desk.edit.meta.title'] ?? 'Edit',
	}
}

export default function Page() {
	const yandexApiKey = process.env.YANDEX_SECRET_KEY

	return (
		<Suspense fallback={<PostingEditPageSkeleton />}>
			<EditPage yandexApiKey={yandexApiKey} />
		</Suspense>
	)
}

