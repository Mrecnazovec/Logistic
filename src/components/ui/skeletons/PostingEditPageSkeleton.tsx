import { Skeleton } from '@/components/ui/Skeleton'

export function PostingEditPageSkeleton() {
	return (
		<div>
			<div className='grid gap-x-6 gap-y-4 lg:grid-cols-2'>
				{Array.from({ length: 4 }).map((_, index) => (
					<section key={index} className='space-y-4 rounded-4xl bg-background p-5 md:p-6'>
						<Skeleton className='mb-2 h-7 w-44 rounded-full' />
						<Skeleton className='h-11 w-full rounded-3xl' />
						<Skeleton className='h-11 w-full rounded-3xl' />
						<Skeleton className='h-11 w-full rounded-3xl' />
						<Skeleton className='h-11 w-full rounded-3xl' />
					</section>
				))}
			</div>
			<div className='mt-4 flex items-center justify-center gap-4 sm:justify-end'>
				<Skeleton className='h-10 w-28 rounded-full' />
				<Skeleton className='h-10 w-28 rounded-full' />
			</div>
		</div>
	)
}

