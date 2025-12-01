'use client'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
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
import { formatFileSize as formatFileSizeHelper } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { IOrderDocument } from '@/shared/types/Order.interface'

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

const STATUS_LABELS: Record<UploadStatus, string> = {
	pending: 'Р’ РѕС‡РµСЂРµРґРё',
	uploading: 'Р—Р°РіСЂСѓР¶Р°РµС‚СЃСЏ',
	success: 'Р“РѕС‚РѕРІРѕ',
	error: 'РћС€РёР±РєР°',
}

const FOLDER_LABELS: Record<string, string> = {
	licenses: 'Р›РёС†РµРЅР·РёРё',
	contracts: 'Р”РѕРіРѕРІРѕСЂС‹',
	loading: 'РџРѕРіСЂСѓР·РєР°',
	unloading: 'Р Р°Р·РіСЂСѓР·РєР°',
	other: 'РџСЂРѕС‡РёРµ РґРѕРєСѓРјРµРЅС‚С‹',
}

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
	const params = useParams<{ id: string; folder: string }>()
	const orderId = params.id
	const normalizedFolder = (params.folder ?? 'others').toLowerCase()
	const normalizedCategory = normalizedFolder === 'others' ? 'other' : normalizedFolder
	const folderLabel = FOLDER_LABELS[normalizedFolder] ?? params.folder ?? 'Р”РѕРєСѓРјРµРЅС‚С‹'

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

const formatFileSize = useCallback((bytes?: number | null) => formatFileSizeHelper(bytes, '—'), [])

	const beginUpload = useCallback(
		(item: UploadQueueItem) => {
			if (!orderId) {
				toast.error('РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ РЅРѕРјРµСЂ Р·Р°РєР°Р·Р°')
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
			})
				.then(() => {
					clearUploadTimer(item.id)
					setUploadQueue((current) =>
						current.map((queueItem) =>
							queueItem.id === item.id
								? { ...queueItem, status: 'success', progress: 100 }
								: queueItem
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
									error: 'РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ С„Р°Р№Р». РџРѕРїСЂРѕР±СѓР№С‚Рµ РµС‰С‘ СЂР°Р·.',
								}
								: queueItem
						)
					)
				})
		},
		[clearUploadTimer, normalizedFolder, orderId, uploadOrderDocumentAsync]
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
				const validationError = validateFile(file)
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
		[beginUpload]
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

	return (
		<><section className='rounded-4xl bg-background p-8 space-y-8 mb-4'>
			<header className='flex flex-wrap items-center justify-between gap-4'>
				<div>
					<p className='text-xs uppercase tracking-[0.2em] text-muted-foreground'>РџР°РїРєР°</p>
					<h1 className='text-2xl font-semibold tracking-tight'>{folderLabel}</h1>
				</div>
				<Badge variant='secondary' className='text-sm font-medium px-3 py-1 rounded-full'>
					{documentsForFolder.length} С„Р°Р№Р»РѕРІ
				</Badge>
			</header>

			<div
				role='button'
				tabIndex={0}
				aria-label='Р—Р°РіСЂСѓР·РёС‚СЊ РґРѕРєСѓРјРµРЅС‚С‹'
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
					<span className='text-brand'>РљР»РёРєРЅРёС‚Рµ С‡С‚РѕР±С‹ Р·Р°РіСЂСѓР·РёС‚СЊ</span> РёР»Рё РїРµСЂРµС‚Р°С‰РёС‚Рµ СЃСЋРґР°
				</p>
				<p className='text-sm text-muted-foreground'>
					DOC, PNG, PDF РёР»Рё GIF (РјР°РєСЃ. 5 РњР‘)
				</p>
				<Button type='button' variant='outline' size='sm' className='mt-2'>
					Р’С‹Р±СЂР°С‚СЊ С„Р°Р№Р»С‹
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


		</section>
			<section className='space-y-4'>
				<div className='flex items-center justify-between'>
					{uploadQueue.length ? (
						<span className='text-sm text-muted-foreground'>
							Р’ РѕС‡РµСЂРµРґРё: {uploadQueue.length}
						</span>
					) : null}
				</div>

				<div className='space-y-3' aria-live='polite'>
					{uploadQueue.map((item) => (
						<UploadingFileRow
							key={item.id}
							item={item}
							onRemove={handleRemoveFromQueue}
							formatFileSize={formatFileSize}
						/>
					))}
				</div>

				{isLoading ? (
					<DocumentListSkeleton />
				) : (
					<div className='space-y-3'>
						{documentsForFolder.map((document) => (
							<DocumentListItem
								key={document.id}
								document={document}
								formatFileSize={formatFileSize}
							/>
						))}
					</div>
				)}

				{hasNoContent ? <EmptyState /> : null}
			</section></>
	)
}

type UploadingFileRowProps = {
	item: UploadQueueItem
	onRemove: (id: string) => void
	formatFileSize: (bytes?: number | null) => string
}

function UploadingFileRow({ item, onRemove, formatFileSize }: UploadingFileRowProps) {
	const extension = getExtension(item.file.name)
	const variant = BADGE_VARIANT_BY_EXTENSION[extension] ?? 'secondary'

	return (
		<div className='rounded-2xl px-5 py-4 bg-background space-y-3'>
			<div className='flex flex-wrap items-start gap-4'>
				<FileThumbnail fileName={item.file.name} />
				<div className='flex-1 min-w-[220px] space-y-1'>
					<div className='flex flex-wrap items-center gap-2'>
						<p className='font-medium text-base'>{item.file.name}</p>
						<Badge variant={variant} className='uppercase tracking-wide'>
							{extension || 'FILE'}
						</Badge>
					</div>
					<p className='text-sm text-muted-foreground'>{formatFileSize(item.file.size)}</p>
				</div>
				<div className='flex items-center gap-3'>
					<StatusPill status={item.status} />
					<Button
						type='button'
						size='icon'
						variant='ghost'
						disabled={item.status === 'uploading'}
						onClick={() => onRemove(item.id)}
					>
						<Trash2 className='size-4' />
						<span className='sr-only'>РЈРґР°Р»РёС‚СЊ С„Р°Р№Р» {item.file.name}</span>
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

			<p
				className={cn(
					'text-sm',
					item.status === 'error' ? 'text-destructive' : 'text-muted-foreground'
				)}
			>
				{item.error ?? STATUS_LABELS[item.status]}
			</p>
		</div>
	)
}

type DocumentListItemProps = {
	document: IOrderDocument
	formatFileSize: (bytes?: number | null) => string
}

function DocumentListItem({ document, formatFileSize }: DocumentListItemProps) {
	const extension = getExtension(document.file_name ?? document.title ?? '')
	const variant = BADGE_VARIANT_BY_EXTENSION[extension] ?? 'secondary'
	const displayName = document.file_name ?? document.title ?? 'Р”РѕРєСѓРјРµРЅС‚'

	return (
		<div className='rounded-2xl border px-5 py-4 bg-card/40 flex flex-col gap-3 md:flex-row md:items-center'>
			<div className='flex flex-1 items-start gap-4'>
				<FileThumbnail fileName={displayName} />
				<div className='space-y-1'>
					<div className='flex flex-wrap items-center gap-2'>
						<p className='font-semibold text-base'>{displayName}</p>
						<Badge variant={variant} className='uppercase tracking-wide'>
							{extension || 'FILE'}
						</Badge>
					</div>
					<p className='text-sm text-muted-foreground'>
						{formatFileSize(document.file_size)} В· Р·Р°РіСЂСѓР¶РµРЅРѕ {document.uploaded_by}
					</p>
				</div>
			</div>

			<div className='flex items-center gap-3 md:ml-auto'>
				<p className='text-sm text-muted-foreground'>
					{document.created_at ? formatDate(document.created_at) : 'вЂ”'}
				</p>
				<Button asChild variant='ghost' size='sm' className='gap-2'>
					<a href={document.file} download target='_blank' rel='noreferrer'>
						<Download className='size-4' />
						РЎРєР°С‡Р°С‚СЊ
					</a>
				</Button>
			</div>
		</div>
	)
}

function FileThumbnail({ fileName }: { fileName: string }) {
	const extension = getExtension(fileName)
	const mappedIcon = FILE_THUMBNAIL_BY_EXTENSION[extension]
	const IconComponent = mappedIcon?.icon
		? mappedIcon.icon
		: IMAGE_EXTENSIONS.includes(extension)
			? ImageIcon
			: FileText
	const colorClasses = mappedIcon?.className ?? 'bg-muted text-muted-foreground'

	return (
		<div className={cn('size-12 rounded-2xl flex items-center justify-center', colorClasses)}>
			<IconComponent className='size-6' aria-hidden />
		</div>
	)
}

function StatusPill({ status }: { status: UploadStatus }) {
	if (status === 'success') {
		return (
			<span className='inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600'>
				<CheckCircle2 className='size-4' /> {STATUS_LABELS[status]}
			</span>
		)
	}

	if (status === 'error') {
		return (
			<span className='inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive'>
				<FileWarning className='size-4' /> {STATUS_LABELS[status]}
			</span>
		)
	}

	if (status === 'uploading') {
		return (
			<span className='inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand'>
				<Loader2 className='size-4 animate-spin' /> {STATUS_LABELS[status]}
			</span>
		)
	}

	return (
		<span className='inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground'>
			<Clock className='size-4' /> {STATUS_LABELS[status]}
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

function EmptyState() {
	return (
		<div className='rounded-3xl border border-dashed px-6 py-14 text-center text-muted-foreground space-y-2'>
			<p className='text-base font-medium'>Р’ СЌС‚РѕР№ РїР°РїРєРµ РїРѕРєР° РЅРµС‚ РґРѕРєСѓРјРµРЅС‚РѕРІ</p>
			<p className='text-sm'>Р”РѕР±Р°РІСЊС‚Рµ С„Р°Р№Р»С‹ С‡РµСЂРµР· С„РѕСЂРјСѓ РІС‹С€Рµ вЂ” РѕРЅРё РїРѕСЏРІСЏС‚СЃСЏ Р·РґРµСЃСЊ Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё.</p>
		</div>
	)
}

function formatDate(value: string) {
	try {
		return format(new Date(value), 'dd MMM yyyy, HH:mm', { locale: ru })
	} catch {
		return value
	}
}

function getExtension(fileName?: string) {
	if (!fileName?.includes('.')) return ''
	return fileName.split('.').pop()?.toLowerCase() ?? ''
}

function validateFile(file: File) {
	const extension = getExtension(file.name)
	const isMimeAllowed = ACCEPTED_MIME_TYPES.includes(file.type as (typeof ACCEPTED_MIME_TYPES)[number])
	const isExtensionAllowed = ACCEPTED_EXTENSIONS.includes(`.${extension}` as (typeof ACCEPTED_EXTENSIONS)[number])

	if (!isMimeAllowed && !isExtensionAllowed) {
		return 'РќРµРїРѕРґРґРµСЂР¶РёРІР°РµРјС‹Р№ С„РѕСЂРјР°С‚ С„Р°Р№Р»Р°'
	}

	if (file.size > MAX_FILE_SIZE_BYTES) {
		return 'Р¤Р°Р№Р» РїСЂРµРІС‹С€Р°РµС‚ 15 РњР‘'
	}

	return null
}







