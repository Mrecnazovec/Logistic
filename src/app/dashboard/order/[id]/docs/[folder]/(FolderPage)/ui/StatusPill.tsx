import { CheckCircle2, Clock, FileWarning, Loader2 } from 'lucide-react'
import type { UploadStatus } from '../types/folderPage.types'

type StatusPillProps = {
	status: UploadStatus
	statusLabels: Record<UploadStatus, string>
}

export function StatusPill({ status, statusLabels }: StatusPillProps) {
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
