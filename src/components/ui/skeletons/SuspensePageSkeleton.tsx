import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

type SuspensePageSkeletonVariant = 'dashboard' | 'form' | 'detail'

type SuspensePageSkeletonProps = {
	variant?: SuspensePageSkeletonVariant
	className?: string
}

export function SuspensePageSkeleton({ variant = 'dashboard', className }: SuspensePageSkeletonProps) {
	if (variant === 'form') {
		return (
			<div className={cn('mx-auto w-full max-w-2xl rounded-4xl bg-background p-6 md:p-8', className)}>
				<div className='space-y-4'>
					<Skeleton className='h-8 w-1/3 rounded-full' />
					<Skeleton className='h-11 w-full rounded-3xl' />
					<Skeleton className='h-11 w-full rounded-3xl' />
					<Skeleton className='h-11 w-full rounded-3xl' />
					<div className='flex gap-3 pt-2'>
						<Skeleton className='h-11 w-32 rounded-full' />
						<Skeleton className='h-11 w-28 rounded-full' />
					</div>
				</div>
			</div>
		)
	}

	if (variant === 'detail') {
		return (
			<div className={cn('space-y-4 rounded-4xl bg-background p-4 md:p-6', className)}>
				<div className='space-y-3'>
					<Skeleton className='h-7 w-56 rounded-full' />
					<Skeleton className='h-5 w-2/3 rounded-full' />
				</div>
				<div className='grid gap-3 md:grid-cols-2'>
					<Skeleton className='h-28 w-full rounded-3xl' />
					<Skeleton className='h-28 w-full rounded-3xl' />
				</div>
				<Skeleton className='h-44 w-full rounded-3xl' />
			</div>
		)
	}

	return (
		<div className={cn('space-y-4', className)}>
			<div className='hidden rounded-4xl bg-background p-4 md:block'>
				<div className='space-y-3'>
					<Skeleton className='h-11 w-full rounded-3xl' />
					<Skeleton className='h-11 w-full rounded-3xl' />
				</div>
			</div>
			<div className='rounded-4xl bg-background p-4'>
				<div className='mb-4 flex items-center justify-between gap-3'>
					<Skeleton className='h-8 w-36 rounded-full' />
					<Skeleton className='h-8 w-24 rounded-full' />
				</div>
				<div className='space-y-3'>
					<Skeleton className='h-16 w-full rounded-3xl' />
					<Skeleton className='h-16 w-full rounded-3xl' />
					<Skeleton className='h-16 w-full rounded-3xl' />
					<Skeleton className='h-16 w-full rounded-3xl' />
				</div>
			</div>
		</div>
	)
}

