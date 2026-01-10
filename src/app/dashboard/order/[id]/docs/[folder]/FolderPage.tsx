'use client'

import { format } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import {
	CheckCircle2,
	Clock,
	Download,
	FileText,
	FileType,
	FileWarning,
	Image as ImageIcon,
	Loader2,
	Presentation,
	Trash2,
	UploadCloud,
	type LucideIcon,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGetOrderDocuments } from '@/hooks/queries/orders/useGet/useGetOrderDocuments'
import { useUploadOrderDocument } from '@/hooks/queries/orders/useUploadOrderDocument'
import { useI18n } from '@/i18n/I18nProvider'
import { formatFileSize as formatFileSizeHelper } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { RoleEnum } from '@/shared/enums/Role.enum'
import type { IOrderDocument } from '@/shared/types/Order.interface'
import { useRoleStore } from '@/store/useRoleStore'

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error'

type UploadQueueItem = {
	id: string
	file: File
	progress: number
	status: UploadStatus
	error?: string
}

const ACCEPTED_MIME_TYPES = [
	'application/pdf',
	'image/png',
	'image/gif',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.ms-powerpoint',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
] as const

const ACCEPTED_EXTENSIONS = ['.pdf', '.png', '.gif', '.doc', '.docx', '.ppt', '.pptx'] as const
const FILE_INPUT_ACCEPT = [...ACCEPTED_MIME_TYPES, ...ACCEPTED_EXTENSIONS].join(',')
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']

const BADGE_VARIANT_BY_EXTENSION: Record<
	string,
	'info' | 'success' | 'warning' | 'danger' | 'secondary'
> = {
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

export function FolderPage() {
	const { t, locale } = useI18n()
	const params = useParams<{ id: string; folder: string }>()
	const orderId = params.id
	const folderParam = Array.isArray(params.folder) ? params.folder[0] : params.folder
	const normalizedFolder = (folderParam ?? 'others').toLowerCase()
	const normalizedCategory = normalizedFolder === 'others' ? 'other' : normalizedFolder
	const folderKey = normalizedFolder === 'others' ? 'other' : normalizedFolder
	const folderLabel = t(`order.docs.folder.${folderKey}` as string, {})
	const resolvedFolderLabel = folderLabel.includes('order.docs.folder.') ? t('order.docs.section.documents') : folderLabel
	const role = useRoleStore((state) => state.role)
	const isUploadBlocked =
		(role === RoleEnum.CUSTOMER || role === RoleEnum.LOGISTIC) &&
		(normalizedFolder === 'loading' || normalizedFolder === 'unloading')

	const statusLabels: Record<UploadStatus, string> = {
		pending: t('order.docs.upload.status.pending'),
		uploading: t('order.docs.upload.status.uploading'),
		success: t('order.docs.upload.status.success'),
		error: t('order.docs.upload.status.error'),
	}

	const fileInputRef = useRef<HTMLInputElement>(null)
	const uploadTimersRef = useRef<Record<string, number>>({})
	const removalTimersRef = useRef<Record<string, number>>({})

	const [isDragActive, setIsDragActive] = useState(false)
	const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([])

	const { orderDocuments, isLoading } = useGetOrderDocuments()
	const { uploadOrderDocumentAsync } = useUploadOrderDocument()

	const documentsForFolder = useMemo(() => {
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
	}, [orderDocuments, normalizedCategory, normalizedFolder])

	const clearUploadTimer = useCallback((uploadId: string) => {
		const timerId = uploadTimersRef.current[uploadId]
		if (timerId) {
			window.clearInterval(timerId)
			delete uploadTimersRef.current[uploadId]
		}
	}, [])

	const formatFileSize = useCallback((bytes?: number | null) => formatFileSizeHelper(bytes, '-'), [])

	const beginUpload = useCallback(
		(item: UploadQueueItem) => {
			if (!orderId) {
				toast.error(t('order.docs.upload.errors.orderMissing'))
				return
			}

			setUploadQueue((current) =>
				current.map((queueItem) =>
					queueItem.id === item.id
						? { ...queueItem, status: 'uploading', progress: Math.max(queueItem.progress, 12) }
						: queueItem
				)
			)

			const timerId = window.setInterval(() => {
				setUploadQueue((current) =>
					current.map((queueItem) => {
						if (queueItem.id !== item.id || queueItem.status !== 'uploading') {
							return queueItem
						}

						const nextProgress = Math.min(queueItem.progress + 8 + Math.random() * 10, 95)
						return { ...queueItem, progress: nextProgress }
					})
				)
			}, 450)

			uploadTimersRef.current[item.id] = timerId

			uploadOrderDocumentAsync({
				id: orderId,
				data: {
					title: normalizedFolder,
					file: item.file,
				},
				category: normalizedCategory,
			})
				.then(() => {
					clearUploadTimer(item.id)
					setUploadQueue((current) =>
						current.map((queueItem) =>
							queueItem.id === item.id ? { ...queueItem, status: 'success', progress: 100 } : queueItem
						)
					)

					removalTimersRef.current[item.id] = window.setTimeout(() => {
						setUploadQueue((current) => current.filter((queueItem) => queueItem.id !== item.id))
						delete removalTimersRef.current[item.id]
					}, 1500)
				})
				.catch(() => {
					clearUploadTimer(item.id)
					setUploadQueue((current) =>
						current.map((queueItem) =>
							queueItem.id === item.id
								? {
									...queueItem,
									status: 'error',
									error: t('order.docs.upload.errors.uploadFailed'),
								}
								: queueItem
						)
					)
				})
		},
		[clearUploadTimer, normalizedCategory, normalizedFolder, orderId, t, uploadOrderDocumentAsync]
	)

	useEffect(() => {
		const uploadTimers = uploadTimersRef.current
		const removalTimers = removalTimersRef.current

		return () => {
			Object.values(uploadTimers).forEach((timerId) => window.clearInterval(timerId))
			Object.values(removalTimers).forEach((timerId) => window.clearTimeout(timerId))
		}
	}, [])

	const handleFiles = useCallback(
		(files: FileList | File[] | null) => {
			const parsedFiles = files ? Array.from(files) : []
			if (!parsedFiles.length) return

			const newQueueItems: UploadQueueItem[] = []

			parsedFiles.forEach((file) => {
				const validationError = validateFile(file, t)
				if (validationError) {
					toast.error(`${file.name}: ${validationError}`)
					return
				}

				const uploadId =
					typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
						? crypto.randomUUID()
						: `${file.name}-${Date.now()}-${Math.random() * 1000}`

				newQueueItems.push({
					id: uploadId,
					file,
					progress: 0,
					status: 'pending',
				})
			})

			if (!newQueueItems.length) return

			setUploadQueue((current) => [...current, ...newQueueItems])
			newQueueItems.forEach(beginUpload)
		},
		[beginUpload, t]
	)

	const handleInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			handleFiles(event.target.files)
			event.target.value = ''
		},
		[handleFiles]
	)

	const handleDrop = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault()
			setIsDragActive(false)
			handleFiles(event.dataTransfer.files)
		},
		[handleFiles]
	)

	const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			fileInputRef.current?.click()
		}
	}, [])

	const handleRemoveFromQueue = useCallback(
		(uploadId: string) => {
			clearUploadTimer(uploadId)
			const timeoutId = removalTimersRef.current[uploadId]
			if (timeoutId) {
				window.clearTimeout(timeoutId)
				delete removalTimersRef.current[uploadId]
			}

			setUploadQueue((current) => current.filter((item) => item.id !== uploadId))
		},
		[clearUploadTimer]
	)

	const hasNoContent = !isLoading && !uploadQueue.length && !documentsForFolder.length
	const dateLocale = locale === 'en' ? enUS : ru

	const documentsCountLabel = useMemo(() => {
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
	}, [documentsForFolder.length, locale, t])

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

				{isUploadBlocked ? (
					<div className='rounded-3xl border border-dashed px-6 py-10 text-center text-muted-foreground'>
						{t('order.docs.upload.onlyCarrier')}
					</div>
				) : (
					<div
						role='button'
						tabIndex={0}
						aria-label={t('order.docs.upload.aria')}
						aria-busy={uploadQueue.some((item) => item.status === 'uploading')}
						onClick={() => fileInputRef.current?.click()}
						onKeyDown={handleKeyDown}
						onDragOver={(event) => {
							event.preventDefault()
							setIsDragActive(true)
						}}
						onDragLeave={(event) => {
							event.preventDefault()
							setIsDragActive(false)
						}}
						onDrop={handleDrop}
						className={cn(
							'border-2 border-dashed border-border rounded-3xl px-6 py-10 text-center flex flex-col items-center gap-3 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/50 bg-card/60',
							isDragActive && 'border-brand bg-brand/5 shadow-[0_0_0_1px] shadow-brand/30'
						)}
					>
						<UploadCloud className='size-12 text-muted-foreground' aria-hidden />
						<p className='text-lg font-medium text-primary'>
							<span className='text-brand'>{t('order.docs.upload.drag')}</span> {t('order.docs.upload.orClick')}
						</p>
						<p className='text-sm text-muted-foreground'>{t('order.docs.upload.formats')}</p>
						<Button type='button' variant='outline' size='sm' className='mt-2'>
							{t('order.docs.upload.select')}
						</Button>
						<input
							ref={fileInputRef}
							id='order-documents-input'
							type='file'
							multiple
							accept={FILE_INPUT_ACCEPT}
							className='sr-only'
							onChange={handleInputChange}
						/>
					</div>
				)}
			</section>

			<section className='space-y-4'>
				<div className='flex items-center justify-between'>
					{!isUploadBlocked && uploadQueue.length ? (
						<span className='text-sm text-muted-foreground'>{t('order.docs.upload.queue', { count: uploadQueue.length })}</span>
					) : null}
				</div>

				{!isUploadBlocked ? (
					<div className='space-y-3' aria-live='polite'>
						{uploadQueue.map((item) => (
							<UploadingFileRow
								key={item.id}
								item={item}
								onRemove={handleRemoveFromQueue}
								formatFileSize={formatFileSize}
								statusLabels={statusLabels}
								fileLabel={t('order.docs.fileLabel')}
								removeLabel={t('order.docs.removeFile')}
							/>
						))}
					</div>
				) : null}

				{isLoading ? (
					<DocumentListSkeleton />
				) : (
					<div className='space-y-3'>
						{documentsForFolder.map((document) => (
							<DocumentListItem
								key={document.id}
								document={document}
								formatFileSize={formatFileSize}
								dateLocale={dateLocale}
								downloadLabel={t('order.docs.download')}
								uploadedByLabel={t('order.docs.uploadedBy')}
								fileLabel={t('order.docs.fileLabel')}
							/>
						))}
					</div>
				)}

				{hasNoContent ? <EmptyState title={t('order.docs.empty.title')} description={t('order.docs.empty.description')} /> : null}
			</section>
		</>
	)
}

type UploadingFileRowProps = {
	item: UploadQueueItem
	onRemove: (id: string) => void
	formatFileSize: (bytes?: number | null) => string
	statusLabels: Record<UploadStatus, string>
	fileLabel: string
	removeLabel: string
}

function UploadingFileRow({ item, onRemove, formatFileSize, statusLabels, fileLabel, removeLabel }: UploadingFileRowProps) {
	const extension = getExtension(item.file.name)
	const variant = BADGE_VARIANT_BY_EXTENSION[extension] ?? 'secondary'

	return (
		<div className='rounded-2xl px-5 py-4 bg-background space-y-3'>
			<div className='flex flex-wrap items-start gap-4'>
				<FileThumbnail fileName={item.file.name} fileLabel={fileLabel} />
				<div className='flex-1 min-w-[220px] space-y-1'>
					<div className='flex flex-wrap items-center gap-2'>
						<p className='font-medium text-base'>{item.file.name}</p>
						<Badge variant={variant} className='uppercase tracking-wide'>
							{extension || fileLabel}
						</Badge>
					</div>
					<p className='text-sm text-muted-foreground'>{formatFileSize(item.file.size)}</p>
				</div>
				<div className='flex items-center gap-3'>
					<StatusPill status={item.status} statusLabels={statusLabels} />
					<Button
						type='button'
						size='icon'
						variant='ghost'
						disabled={item.status === 'uploading'}
						onClick={() => onRemove(item.id)}
					>
						<Trash2 className='size-4' />
						<span className='sr-only'>{removeLabel} {item.file.name}</span>
					</Button>
				</div>
			</div>

			<div className='h-1.5 w-full rounded-full bg-muted overflow-hidden'>
				<div
					className={cn(
						'h-full rounded-full transition-all duration-300',
						item.status === 'error' ? 'bg-destructive' : 'bg-brand'
					)}
					style={{ width: `${Math.min(item.progress, 100)}%` }}
				/>
			</div>

			<p className={cn('text-sm', item.status === 'error' ? 'text-destructive' : 'text-muted-foreground')}>
				{item.error ?? statusLabels[item.status]}
			</p>
		</div>
	)
}

type DocumentListItemProps = {
	document: IOrderDocument
	formatFileSize: (bytes?: number | null) => string
	dateLocale: Locale
	downloadLabel: string
	uploadedByLabel: string
	fileLabel: string
}

type Locale = typeof ru | typeof enUS

function DocumentListItem({ document, formatFileSize, dateLocale, downloadLabel, uploadedByLabel, fileLabel }: DocumentListItemProps) {
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
						{formatFileSize(document.file_size)} / {uploadedByLabel} {document.uploaded_by}
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

function StatusPill({ status, statusLabels }: { status: UploadStatus; statusLabels: Record<UploadStatus, string> }) {
	if (status === 'success') {
		return (
			<span className='inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600'>
				<CheckCircle2 className='size-4' /> {statusLabels[status]}
			</span>
		)
	}

	if (status === 'error') {
		return (
			<span className='inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive'>
				<FileWarning className='size-4' /> {statusLabels[status]}
			</span>
		)
	}

	if (status === 'uploading') {
		return (
			<span className='inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand'>
				<Loader2 className='size-4 animate-spin' /> {statusLabels[status]}
			</span>
		)
	}

	return (
		<span className='inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground'>
			<Clock className='size-4' /> {statusLabels[status]}
		</span>
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

function EmptyState({ title, description }: { title: string; description: string }) {
	return (
		<div className='rounded-3xl border border-dashed px-6 py-14 text-center text-muted-foreground space-y-2'>
			<p className='text-base font-medium'>{title}</p>
			<p className='text-sm'>{description}</p>
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

function validateFile(file: File, t: (key: string) => string) {
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
