import { Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { BADGE_VARIANT_BY_EXTENSION } from '../constants/folderPage.constants'
import { getExtension } from '../lib/folderPage.utils'
import type { UploadQueueItem, UploadStatus } from '../types/folderPage.types'
import { FileThumbnail } from './FileThumbnail'
import { StatusPill } from './StatusPill'

type FolderUploadQueueProps = {
	uploadQueue: UploadQueueItem[]
	onRemove: (id: string) => void
	formatFileSize: (bytes?: number | null) => string
	statusLabels: Record<UploadStatus, string>
	fileLabel: string
	removeLabel: string
}

export function FolderUploadQueue({
	uploadQueue,
	onRemove,
	formatFileSize,
	statusLabels,
	fileLabel,
	removeLabel,
}: FolderUploadQueueProps) {
	return (
		<div className='space-y-3' aria-live='polite'>
			{uploadQueue.map((item) => (
				<UploadingFileRow
					key={item.id}
					item={item}
					onRemove={onRemove}
					formatFileSize={formatFileSize}
					statusLabels={statusLabels}
					fileLabel={fileLabel}
					removeLabel={removeLabel}
				/>
			))}
		</div>
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
					<Button type='button' size='icon' variant='ghost' disabled={item.status === 'uploading'} onClick={() => onRemove(item.id)}>
						<Trash2 className='size-4' />
						<span className='sr-only'>
							{removeLabel} {item.file.name}
						</span>
					</Button>
				</div>
			</div>

			<div className='h-1.5 w-full rounded-full bg-muted overflow-hidden'>
				<div
					className={cn('h-full rounded-full transition-all duration-300', item.status === 'error' ? 'bg-destructive' : 'bg-brand')}
					style={{ width: `${Math.min(item.progress, 100)}%` }}
				/>
			</div>

			<p className={cn('text-sm', item.status === 'error' ? 'text-destructive' : 'text-muted-foreground')}>
				{item.error ?? statusLabels[item.status]}
			</p>
		</div>
	)
}
