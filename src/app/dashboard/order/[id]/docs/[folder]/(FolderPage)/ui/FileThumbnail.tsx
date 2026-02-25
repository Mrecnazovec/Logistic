import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DEFAULT_FILE_THUMBNAIL_ICON, FILE_THUMBNAIL_BY_EXTENSION, IMAGE_EXTENSIONS } from '../constants/folderPage.constants'
import { getExtension } from '../lib/folderPage.utils'

type FileThumbnailProps = {
	fileName: string
	fileLabel: string
}

export function FileThumbnail({ fileName, fileLabel }: FileThumbnailProps) {
	const extension = getExtension(fileName)
	const mappedIcon = FILE_THUMBNAIL_BY_EXTENSION[extension]
	const IconComponent = mappedIcon?.icon
		? mappedIcon.icon
		: IMAGE_EXTENSIONS.includes(extension)
			? DEFAULT_FILE_THUMBNAIL_ICON
			: FileText
	const colorClasses = mappedIcon?.className ?? 'bg-muted text-muted-foreground'

	return (
		<div className={cn('size-12 rounded-2xl flex items-center justify-center', colorClasses)}>
			<IconComponent className='size-6' aria-hidden />
			<span className='sr-only'>{fileLabel}</span>
		</div>
	)
}
