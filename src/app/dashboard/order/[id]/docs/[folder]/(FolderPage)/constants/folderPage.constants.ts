import {
	FileText,
	FileType,
	Image as ImageIcon,
	Presentation,
	type LucideIcon,
} from 'lucide-react'

export const ACCEPTED_MIME_TYPES = [
	'application/pdf',
	'image/png',
	'image/gif',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.ms-powerpoint',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
] as const

export const ACCEPTED_EXTENSIONS = ['.pdf', '.png', '.gif', '.doc', '.docx', '.ppt', '.pptx'] as const
export const FILE_INPUT_ACCEPT = [...ACCEPTED_MIME_TYPES, ...ACCEPTED_EXTENSIONS].join(',')
export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024

export const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']

export const BADGE_VARIANT_BY_EXTENSION: Record<string, 'info' | 'success' | 'warning' | 'danger' | 'secondary'> = {
	pdf: 'danger',
	doc: 'info',
	docx: 'info',
	png: 'warning',
	gif: 'warning',
	ppt: 'warning',
	pptx: 'warning',
}

export const FILE_THUMBNAIL_BY_EXTENSION: Record<string, { icon: LucideIcon; className: string }> = {
	pdf: { icon: FileType, className: 'bg-destructive/10 text-destructive' },
	doc: { icon: FileText, className: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200' },
	docx: { icon: FileText, className: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200' },
	ppt: { icon: Presentation, className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200' },
	pptx: { icon: Presentation, className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200' },
}

export const DEFAULT_FILE_THUMBNAIL_ICON = ImageIcon
