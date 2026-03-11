import { enUS, ru } from 'date-fns/locale'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useGetOrderDocuments } from '@/hooks/queries/orders/useGet/useGetOrderDocuments'
import { useUploadOrderDocument } from '@/hooks/queries/orders/useUploadOrderDocument'
import { useI18n } from '@/i18n/I18nProvider'
import { formatFileSize as formatFileSizeHelper } from '@/lib/formatters'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { useRoleStore } from '@/store/useRoleStore'
import { buildDocumentsCountLabel, buildDocumentsForFolder, resolveFolderLabel, validateFile } from '../lib/folderPage.utils'
import type { UploadQueueItem, UploadStatus } from '../types/folderPage.types'

export function useFolderPage() {
	const { t, locale } = useI18n()
	const params = useParams<{ id: string; folder: string }>()
	const role = useRoleStore((state) => state.role)
	const { me } = useGetMe()
	const { orderDocuments, isLoading } = useGetOrderDocuments()
	const { uploadOrderDocumentAsync } = useUploadOrderDocument()

	const orderId = params.id
	const folderParam = Array.isArray(params.folder) ? params.folder[0] : params.folder
	const normalizedFolder = (folderParam ?? 'others').toLowerCase()
	const normalizedCategory = normalizedFolder === 'others' ? 'other' : normalizedFolder
	const resolvedFolderLabel = resolveFolderLabel(normalizedFolder, t)

	const orderDetail = Array.isArray(orderDocuments) ? null : orderDocuments
	const participantIds = [
		orderDetail?.roles?.customer?.id,
		orderDetail?.roles?.logistic?.id,
		orderDetail?.roles?.carrier?.id,
	].filter((id): id is number => typeof id === 'number')
	const isOrderParticipant = Boolean(me?.id && participantIds.includes(me.id))
	const isParticipantRestricted = Boolean(orderDetail && me?.id && !isOrderParticipant)
	const isUploadBlocked =
		isParticipantRestricted ||
		((role === RoleEnum.CUSTOMER || role === RoleEnum.LOGISTIC) &&
			(normalizedFolder === 'loading' || normalizedFolder === 'unloading'))

	const [isDragActive, setIsDragActive] = useState(false)
	const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([])

	const fileInputRef = useRef<HTMLInputElement>(null)
	const uploadTimersRef = useRef<Record<string, number>>({})
	const removalTimersRef = useRef<Record<string, number>>({})

	const documentsForFolder = buildDocumentsForFolder(orderDocuments, normalizedCategory, normalizedFolder)
	const documentsCountLabel = buildDocumentsCountLabel(documentsForFolder.length, locale, t)
	const dateLocale = locale === 'en' ? enUS : ru
	const hasNoContent = !isLoading && !uploadQueue.length && !documentsForFolder.length

	const statusLabels: Record<UploadStatus, string> = {
		pending: t('order.docs.upload.status.pending'),
		uploading: t('order.docs.upload.status.uploading'),
		success: t('order.docs.upload.status.success'),
		error: t('order.docs.upload.status.error'),
	}

	const clearUploadTimer = (uploadId: string) => {
		const timerId = uploadTimersRef.current[uploadId]
		if (timerId) {
			window.clearInterval(timerId)
			delete uploadTimersRef.current[uploadId]
		}
	}

	const formatFileSize = (bytes?: number | null) => formatFileSizeHelper(bytes, '-')

	const beginUpload = (item: UploadQueueItem) => {
		if (!orderId) {
			toast.error(t('order.docs.upload.errors.orderMissing'))
			return
		}

		setUploadQueue((current) =>
			current.map((queueItem) =>
				queueItem.id === item.id ? { ...queueItem, status: 'uploading', progress: Math.max(queueItem.progress, 12) } : queueItem,
			),
		)

		const timerId = window.setInterval(() => {
			setUploadQueue((current) =>
				current.map((queueItem) => {
					if (queueItem.id !== item.id || queueItem.status !== 'uploading') return queueItem
					const nextProgress = Math.min(queueItem.progress + 8 + Math.random() * 10, 95)
					return { ...queueItem, progress: nextProgress }
				}),
			)
		}, 450)
		uploadTimersRef.current[item.id] = timerId

		uploadOrderDocumentAsync({
			id: orderId,
			data: { title: normalizedFolder, file: item.file },
			category: normalizedCategory,
		})
			.then(() => {
				clearUploadTimer(item.id)
				setUploadQueue((current) =>
					current.map((queueItem) =>
						queueItem.id === item.id ? { ...queueItem, status: 'success', progress: 100 } : queueItem,
					),
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
							? { ...queueItem, status: 'error', error: t('order.docs.upload.errors.uploadFailed') }
							: queueItem,
					),
				)
			})
	}

	useEffect(() => {
		const uploadTimers = uploadTimersRef.current
		const removalTimers = removalTimersRef.current
		return () => {
			Object.values(uploadTimers).forEach((timerId) => window.clearInterval(timerId))
			Object.values(removalTimers).forEach((timerId) => window.clearTimeout(timerId))
		}
	}, [])

	const handleFiles = (files: FileList | File[] | null) => {
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
					: `${file.name}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
			newQueueItems.push({ id: uploadId, file, progress: 0, status: 'pending' })
		})

		if (!newQueueItems.length) return
		setUploadQueue((current) => [...current, ...newQueueItems])
		newQueueItems.forEach(beginUpload)
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		handleFiles(event.target.files)
		event.target.value = ''
	}

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsDragActive(false)
		handleFiles(event.dataTransfer.files)
	}

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsDragActive(true)
	}

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsDragActive(false)
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			fileInputRef.current?.click()
		}
	}

	const handleRemoveFromQueue = (uploadId: string) => {
		clearUploadTimer(uploadId)
		const timeoutId = removalTimersRef.current[uploadId]
		if (timeoutId) {
			window.clearTimeout(timeoutId)
			delete removalTimersRef.current[uploadId]
		}
		setUploadQueue((current) => current.filter((item) => item.id !== uploadId))
	}

	return {
		t,
		isLoading,
		resolvedFolderLabel,
		documentsCountLabel,
		isUploadBlocked,
		isParticipantRestricted,
		fileInputRef,
		isDragActive,
		uploadQueue,
		documentsForFolder,
		hasNoContent,
		statusLabels,
		dateLocale,
		formatFileSize,
		handleInputChange,
		handleDrop,
		handleDragOver,
		handleDragLeave,
		handleKeyDown,
		handleRemoveFromQueue,
		openFilePicker: () => fileInputRef.current?.click(),
		setIsDragActive,
	}
}
