import { UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { FILE_INPUT_ACCEPT } from '../constants/folderPage.constants'

type FolderUploadDropzoneProps = {
	isUploadBlocked: boolean
	isParticipantRestricted: boolean
	isDragActive: boolean
	fileInputRef: React.RefObject<HTMLInputElement | null>
	isUploading: boolean
	onClick: () => void
	onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void
	onDragOver: (event: React.DragEvent<HTMLDivElement>) => void
	onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void
	onDrop: (event: React.DragEvent<HTMLDivElement>) => void
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	t: (key: string, params?: Record<string, string | number>) => string
}

export function FolderUploadDropzone({
	isUploadBlocked,
	isParticipantRestricted,
	isDragActive,
	fileInputRef,
	isUploading,
	onClick,
	onKeyDown,
	onDragOver,
	onDragLeave,
	onDrop,
	onChange,
	t,
}: FolderUploadDropzoneProps) {
	if (isUploadBlocked) {
		return (
			<div className='rounded-3xl border border-dashed px-6 py-10 text-center text-muted-foreground'>
				{isParticipantRestricted ? t('order.docs.upload.onlyParticipants') : t('order.docs.upload.onlyCarrier')}
			</div>
		)
	}

	return (
		<div
			role='button'
			tabIndex={0}
			aria-label={t('order.docs.upload.aria')}
			aria-busy={isUploading}
			onClick={onClick}
			onKeyDown={onKeyDown}
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
			className={cn(
				'border-2 border-dashed border-border rounded-3xl px-6 py-10 text-center flex flex-col items-center gap-3 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/50 bg-card/60',
				isDragActive && 'border-brand bg-brand/5 shadow-[0_0_0_1px] shadow-brand/30',
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
				onChange={onChange}
			/>
		</div>
	)
}
