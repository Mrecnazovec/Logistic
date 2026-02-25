import { DEFAULT_PLACEHOLDER } from '@/lib/formatters'
import type { IOrderDocument } from '@/shared/types/Order.interface'
import { ACCEPTED_EXTENSIONS, ACCEPTED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '../constants/folderPage.constants'

export const getExtension = (fileName?: string) => {
	if (!fileName?.includes('.')) return ''
	return fileName.split('.').pop()?.toLowerCase() ?? ''
}

export const validateFile = (file: File, t: (key: string) => string) => {
	const extension = getExtension(file.name)
	const isMimeAllowed = ACCEPTED_MIME_TYPES.includes(file.type as (typeof ACCEPTED_MIME_TYPES)[number])
	const isExtensionAllowed = ACCEPTED_EXTENSIONS.includes(`.${extension}` as (typeof ACCEPTED_EXTENSIONS)[number])

	if (!isMimeAllowed && !isExtensionAllowed) {
		return t('order.docs.upload.errors.invalidType')
	}

	if (file.size > MAX_FILE_SIZE_BYTES) {
		return t('order.docs.upload.errors.sizeTooLarge')
	}

	return null
}

export const buildDocumentsForFolder = (
	orderDocuments: IOrderDocument[] | { documents?: IOrderDocument[] } | undefined,
	normalizedCategory: string,
	normalizedFolder: string,
) => {
	const docs = Array.isArray(orderDocuments) ? orderDocuments : orderDocuments?.documents ?? []
	const filtered = docs.filter((document) => {
		const title = (document.title ?? '').toLowerCase()
		const category = (document.category ?? '').toLowerCase()
		return category === normalizedCategory || title === normalizedFolder
	})

	return [...filtered].sort((a, b) => {
		const first = a.created_at ? new Date(a.created_at).getTime() : 0
		const second = b.created_at ? new Date(b.created_at).getTime() : 0
		return second - first
	})
}

export const buildDocumentsCountLabel = (count: number, locale: string, t: (key: string) => string) => {
	if (locale === 'ru') {
		const normalizedCount = Math.abs(count)
		const lastTwoDigits = normalizedCount % 100
		if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} ${t('order.docs.files.many')}`
		const lastDigit = normalizedCount % 10
		if (lastDigit === 1) return `${count} ${t('order.docs.files.one')}`
		if (lastDigit >= 2 && lastDigit <= 4) return `${count} ${t('order.docs.files.few')}`
		return `${count} ${t('order.docs.files.many')}`
	}
	return `${count} ${count === 1 ? t('order.docs.files.one') : t('order.docs.files.many')}`
}

export const resolveFolderLabel = (normalizedFolder: string, t: (key: string, params?: Record<string, string | number>) => string) => {
	const folderKey = normalizedFolder === 'others' ? 'other' : normalizedFolder
	const folderLabel = t(`order.docs.folder.${folderKey}`, {})
	return folderLabel.includes('order.docs.folder.') ? t('order.docs.section.documents') : folderLabel
}

export const getDisplayName = (document: IOrderDocument, fileLabel: string) =>
	document.file_name ?? document.title ?? fileLabel

export const toPlaceholder = (value?: string | null) => value ?? DEFAULT_PLACEHOLDER
