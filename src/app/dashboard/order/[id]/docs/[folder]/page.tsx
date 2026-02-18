import { FolderPage } from './(FolderPage)'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import type { Metadata } from 'next'

type PageProps = {
	params: Promise<{ folder?: string | string[] }>
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	const resolvedParams = await params
	const folderParam = Array.isArray(resolvedParams?.folder) ? resolvedParams?.folder[0] : resolvedParams?.folder
	const normalized = (folderParam ?? 'others').toLowerCase() === 'others'
		? 'other'
		: (folderParam ?? 'others').toLowerCase()
	const key = `order.docs.folder.${normalized}`
	const title = messages[key] ?? messages['order.docs.section.documents'] ?? 'Documents'
	return { title }
}

export default function Page() {
	return <FolderPage />
}
