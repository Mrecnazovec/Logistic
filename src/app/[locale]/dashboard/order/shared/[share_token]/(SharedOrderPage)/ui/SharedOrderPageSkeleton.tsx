import { Skeleton } from '@/components/ui/Skeleton'

export function SharedOrderPageSkeleton() {
	return (
		<div className='space-y-6 rounded-4xl bg-background p-8'>
			<div className='flex items-center gap-3'>
				<Skeleton className='h-7 w-28 rounded-full' />
				<Skeleton className='h-6 w-32 rounded-full' />
			</div>
			<div className='grid gap-15 lg:grid-cols-3'>
				{Array.from({ length: 3 }).map((_, index) => (
					<div key={index} className='space-y-3'>
						<Skeleton className='h-5 w-2/3' />
						{Array.from({ length: 4 }).map((__, rowIndex) => (
							<div key={rowIndex} className='flex items-center justify-between gap-3'>
								<Skeleton className='h-4 w-24' />
								<Skeleton className='h-4 w-32' />
							</div>
						))}
					</div>
				))}
			</div>
			<Skeleton className='h-px w-full' />
			<div className='grid gap-15 lg:grid-cols-3'>
				{Array.from({ length: 3 }).map((_, index) => (
					<div key={index} className='space-y-3'>
						<Skeleton className='h-5 w-2/3' />
						{Array.from({ length: 4 }).map((__, rowIndex) => (
							<div key={rowIndex} className='flex items-center justify-between gap-3'>
								<Skeleton className='h-4 w-28' />
								<Skeleton className='h-4 w-28' />
							</div>
						))}
					</div>
				))}
			</div>
			<Skeleton className='h-px w-full' />
			<div className='grid gap-15 lg:grid-cols-3'>
				<div className='space-y-3'>
					<Skeleton className='h-5 w-1/2' />
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-3/4' />
				</div>
			</div>
		</div>
	)
}
