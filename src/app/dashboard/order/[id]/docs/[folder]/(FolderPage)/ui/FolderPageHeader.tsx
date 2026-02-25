import { Badge } from '@/components/ui/Badge'

type FolderPageHeaderProps = {
	title: string
	documentsCountLabel: string
	sectionLabel: string
}

export function FolderPageHeader({ title, documentsCountLabel, sectionLabel }: FolderPageHeaderProps) {
	return (
		<header className='flex flex-wrap items-center justify-between gap-4'>
			<div>
				<p className='text-xs uppercase tracking-[0.2em] text-muted-foreground'>{sectionLabel}</p>
				<h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
			</div>
			<Badge variant='secondary' className='text-sm font-medium px-3 py-1 rounded-full'>
				{documentsCountLabel}
			</Badge>
		</header>
	)
}
