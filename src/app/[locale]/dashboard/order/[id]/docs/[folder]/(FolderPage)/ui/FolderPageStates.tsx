import { Skeleton } from '@/components/ui/Skeleton'

export function DocumentListSkeleton() {
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

export function EmptyState({ title, description }: { title: string; description: string }) {
	return (
		<div className='rounded-3xl border border-dashed px-6 py-14 text-center text-muted-foreground space-y-2'>
			<p className='text-base font-medium'>{title}</p>
			<p className='text-sm'>{description}</p>
		</div>
	)
}
