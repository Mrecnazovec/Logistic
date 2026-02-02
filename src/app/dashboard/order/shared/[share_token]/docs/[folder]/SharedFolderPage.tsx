'use client'

import { format } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import { Download, FileText, FileType, Image as ImageIcon, Presentation, type LucideIcon } from 'lucide-react'
import { useParams } from 'next/navigation'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGetSharedOrder } from '@/hooks/queries/orders/useGet/useGetSharedOrder'
import { useI18n } from '@/i18n/I18nProvider'
import { formatFileSize as formatFileSizeHelper } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { IOrderDocument } from '@/shared/types/Order.interface'

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']

const BADGE_VARIANT_BY_EXTENSION: Record<string, 'info' | 'success' | 'warning' | 'danger' | 'secondary'> = {
	pdf: 'danger',
	doc: 'info',
	docx: 'info',
	png: 'warning',
	gif: 'warning',
	ppt: 'warning',
	pptx: 'warning',
}

const FILE_THUMBNAIL_BY_EXTENSION: Record<string, { icon: LucideIcon; className: string }> = {
	pdf: { icon: FileType, className: 'bg-destructive/10 text-destructive' },
	doc: { icon: FileText, className: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200' },
	docx: { icon: FileText, className: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200' },
	ppt: { icon: Presentation, className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200' },
	pptx: { icon: Presentation, className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200' },
}

export function SharedFolderPage() {
	const { t, locale } = useI18n()
	const params = useParams<{ folder: string }>()
	const { order, isLoading } = useGetSharedOrder()

	const folderParam = Array.isArray(params.folder) ? params.folder[0] : params.folder
	const normalizedFolder = (folderParam ?? 'others').toLowerCase()
	const normalizedCategory = normalizedFolder === 'others' ? 'other' : normalizedFolder
	const folderKey = normalizedFolder === 'others' ? 'other' : normalizedFolder
	const folderLabel = t(`order.docs.folder.${folderKey}` as string, {})
	const resolvedFolderLabel = folderLabel.includes('order.docs.folder.') ? t('order.docs.section.documents') : folderLabel

	const documentsForFolder = (() => {
		const docs = order?.documents ?? []
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
	})()

	const dateLocale = locale === 'en' ? enUS : ru

	const documentsCountLabel = (() => {
		const count = documentsForFolder.length
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
	})()

	if (!order && !isLoading) {
		return (
			<div className='flex h-full w-full items-center justify-center rounded-4xl bg-background p-8 text-center text-muted-foreground'>
				{t('order.unavailable')}
			</div>
		)
	}

	if (isLoading) return <DocumentListSkeleton />

	return (
		<>
			<section className='rounded-4xl bg-background p-8 space-y-8 mb-4'>
				<header className='flex flex-wrap items-center justify-between gap-4'>
					<div>
						<p className='text-xs uppercase tracking-[0.2em] text-muted-foreground'>{t('order.docs.section.documents')}</p>
						<h1 className='text-2xl font-semibold tracking-tight'>{resolvedFolderLabel}</h1>
					</div>
					<Badge variant='secondary' className='text-sm font-medium px-3 py-1 rounded-full'>
						{documentsCountLabel}
					</Badge>
				</header>
			</section>

			<section className='space-y-4'>
				<div className='space-y-3'>
					{documentsForFolder.map((document) => (
						<DocumentListItem
							key={document.id}
							document={document}
							dateLocale={dateLocale}
							downloadLabel={t('order.docs.download')}
							uploadedByLabel={t('order.docs.uploadedBy')}
							fileLabel={t('order.docs.fileLabel')}
						/>
					))}
				</div>

				{!documentsForFolder.length ? <EmptyState title={t('order.docs.empty.title')}/> : null}
			</section>
		</>
	)
}

type DocumentListItemProps = {
	document: IOrderDocument
	dateLocale: Locale
	downloadLabel: string
	uploadedByLabel: string
	fileLabel: string
}

type Locale = typeof ru | typeof enUS

function DocumentListItem({ document, dateLocale, downloadLabel, uploadedByLabel, fileLabel }: DocumentListItemProps) {
	const extension = getExtension(document.file_name ?? document.title ?? '')
	const variant = BADGE_VARIANT_BY_EXTENSION[extension] ?? 'secondary'
	const displayName = document.file_name ?? document.title ?? fileLabel

	return (
		<div className='rounded-2xl border px-5 py-4 bg-card/40 flex flex-col gap-3 md:flex-row md:items-center'>
			<div className='flex flex-1 items-start gap-4'>
				<FileThumbnail fileName={displayName} fileLabel={fileLabel} />
				<div className='space-y-1'>
					<div className='flex flex-wrap items-center gap-2'>
						<p className='font-semibold text-base'>{displayName}</p>
						<Badge variant={variant} className='uppercase tracking-wide'>
							{extension || fileLabel}
						</Badge>
					</div>
					<p className='text-sm text-muted-foreground'>
						{formatFileSizeHelper(document.file_size, '-')} / {uploadedByLabel} {document.uploaded_by}
					</p>
				</div>
			</div>

			<div className='flex items-center gap-3 md:ml-auto'>
				<p className='text-sm text-muted-foreground'>{document.created_at ? formatDate(document.created_at, dateLocale) : '-'}</p>
				<Button asChild variant='ghost' size='sm' className='gap-2'>
					<a href={document.file} download target='_blank' rel='noreferrer'>
						<Download className='size-4' />
						{downloadLabel}
					</a>
				</Button>
			</div>
		</div>
	)
}

function FileThumbnail({ fileName, fileLabel }: { fileName: string; fileLabel: string }) {
	const extension = getExtension(fileName)
	const mappedIcon = FILE_THUMBNAIL_BY_EXTENSION[extension]
	const IconComponent = mappedIcon?.icon ? mappedIcon.icon : IMAGE_EXTENSIONS.includes(extension) ? ImageIcon : FileText
	const colorClasses = mappedIcon?.className ?? 'bg-muted text-muted-foreground'

	return (
		<div className={cn('size-12 rounded-2xl flex items-center justify-center', colorClasses)}>
			<IconComponent className='size-6' aria-hidden />
			<span className='sr-only'>{fileLabel}</span>
		</div>
	)
}

function DocumentListSkeleton() {
	return (
		<div className='space-y-3'>
			{Array.from({ length: 3 }).map((_, index) => (
				<div key={index} className='rounded-2xl px-5 py-4 bg-background'>
					<div className='flex items-center gap-4'>
						<Skeleton className='size-12 rounded-2xl' />
						<div className='flex-1 space-y-2'>
							<Skeleton className='h-4 w-1/3' />
							<Skeleton className='h-3 w-1/4' />
						</div>
						<Skeleton className='h-9 w-24 rounded-full' />
					</div>
				</div>
			))}
		</div>
	)
}

function EmptyState({ title }: { title: string }) {
	return (
		<div className='rounded-3xl border border-dashed px-6 py-14 text-center text-muted-foreground'>
			<p className='text-base font-medium'>{title}</p>
		</div>
	)
}

function formatDate(value: string, dateLocale: Locale) {
	try {
		return format(new Date(value), 'dd MMM yyyy, HH:mm', { locale: dateLocale })
	} catch {
		return value
	}
}

function getExtension(fileName?: string) {
	if (!fileName?.includes('.')) return ''
	return fileName.split('.').pop()?.toLowerCase() ?? ''
}
