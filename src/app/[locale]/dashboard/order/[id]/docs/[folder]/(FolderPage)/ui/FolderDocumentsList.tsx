import { format } from 'date-fns'
import { Download } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { IOrderDocument } from '@/shared/types/Order.interface'
import { BADGE_VARIANT_BY_EXTENSION } from '../constants/folderPage.constants'
import { getDisplayName, getExtension } from '../lib/folderPage.utils'
import type { DateLocale } from '../types/folderPage.types'
import { FileThumbnail } from './FileThumbnail'

type FolderDocumentsListProps = {
	documents: IOrderDocument[]
	formatFileSize: (bytes?: number | null) => string
	dateLocale: DateLocale
	downloadLabel: string
	uploadedByLabel: string
	fileLabel: string
}

export function FolderDocumentsList({
	documents,
	formatFileSize,
	dateLocale,
	downloadLabel,
	uploadedByLabel,
	fileLabel,
}: FolderDocumentsListProps) {
	return (
		<div className='space-y-3'>
			{documents.map((document) => (
				<DocumentListItem
					key={document.id}
					document={document}
					formatFileSize={formatFileSize}
					dateLocale={dateLocale}
					downloadLabel={downloadLabel}
					uploadedByLabel={uploadedByLabel}
					fileLabel={fileLabel}
				/>
			))}
		</div>
	)
}

type DocumentListItemProps = {
	document: IOrderDocument
	formatFileSize: (bytes?: number | null) => string
	dateLocale: DateLocale
	downloadLabel: string
	uploadedByLabel: string
	fileLabel: string
}

function DocumentListItem({
	document,
	formatFileSize,
	dateLocale,
	downloadLabel,
	uploadedByLabel,
	fileLabel,
}: DocumentListItemProps) {
	const extension = getExtension(document.file_name ?? document.title ?? '')
	const variant = BADGE_VARIANT_BY_EXTENSION[extension] ?? 'secondary'
	const displayName = getDisplayName(document, fileLabel)
	const formattedDate = (() => {
		if (!document.created_at) return '-'
		try {
			return format(new Date(document.created_at), 'dd MMM yyyy, HH:mm', { locale: dateLocale })
		} catch {
			return document.created_at
		}
	})()

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
				<p className='text-sm text-muted-foreground'>{formattedDate}</p>
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
