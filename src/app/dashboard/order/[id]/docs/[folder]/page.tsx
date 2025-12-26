import { FolderPage } from './FolderPage'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'

type PageProps = {
	params: { folder: string }
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	const normalized = (params.folder ?? '').toLowerCase() === 'others'
		? 'other'
		: (params.folder ?? '').toLowerCase()
	const key = `order.docs.folder.${normalized}`
	const title = messages[key] ?? messages['order.docs.section.documents'] ?? 'Documents'
	return { title }
}

export default function page() {
	return <FolderPage />
}
