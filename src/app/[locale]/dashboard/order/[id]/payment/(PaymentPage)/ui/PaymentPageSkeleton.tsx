import { Skeleton } from '@/components/ui/Skeleton'

export function PaymentPageSkeleton() {
	return (
		<div className='space-y-8 rounded-4xl bg-background p-8'>
			{Array.from({ length: 3 }).map((_, index) => (
				<div key={index} className='space-y-4'>
					<div className='flex items-center gap-2'>
						<Skeleton className='size-5 rounded-full' />
						<Skeleton className='h-4 w-48' />
					</div>
					<div className='grid gap-8 lg:grid-cols-2'>
						<div className='space-y-3'>
							{Array.from({ length: 4 }).map((__, rowIndex) => (
								<div key={rowIndex} className='flex items-center justify-between gap-6'>
									<Skeleton className='h-4 w-28' />
									<Skeleton className='h-4 w-40' />
								</div>
							))}
						</div>
						<div className='space-y-3'>
							{Array.from({ length: 3 }).map((__, rowIndex) => (
								<div key={rowIndex} className='flex items-center justify-between gap-6'>
									<Skeleton className='h-4 w-24' />
									<Skeleton className='h-4 w-32' />
								</div>
							))}
						</div>
					</div>
				</div>
			))}
			<div className='flex justify-end gap-3'>
				<Skeleton className='h-11 w-28 rounded-full' />
				<Skeleton className='h-11 w-24 rounded-full' />
				<Skeleton className='h-11 w-28 rounded-full' />
			</div>
		</div>
	)
}
