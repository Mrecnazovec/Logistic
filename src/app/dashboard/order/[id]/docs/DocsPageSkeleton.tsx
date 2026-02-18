import { Skeleton } from '@/components/ui/Skeleton'

export function DocsPageSkeleton() {
	return (
		<div className='h-full space-y-4 rounded-3xl bg-background p-8'>
			{Array.from({ length: 5 }).map((_, index) => (
				<div key={index} className='flex items-center justify-between gap-6 border-b-2 pb-4 last:border-none last:pb-0'>
					<div className='flex items-center gap-4'>
						<Skeleton className='size-[55px] rounded-2xl' />
						<div className='space-y-2'>
							<Skeleton className='h-5 w-40 rounded-full' />
							<Skeleton className='h-4 w-24 rounded-full' />
						</div>
					</div>
					<Skeleton className='h-8 w-8 rounded-full' />
				</div>
			))}
		</div>
	)
}

