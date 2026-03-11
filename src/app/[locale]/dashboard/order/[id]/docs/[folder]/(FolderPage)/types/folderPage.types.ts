import type { enUS, ru } from 'date-fns/locale'

export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error'

export type UploadQueueItem = {
	id: string
	file: File
	progress: number
	status: UploadStatus
	error?: string
}

export type DateLocale = typeof ru | typeof enUS
