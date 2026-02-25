import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

type SuspensePageSkeletonVariant = 'dashboard' | 'form' | 'detail' | 'auth'

type SuspensePageSkeletonProps = {
	variant?: SuspensePageSkeletonVariant
	className?: string
}

export function SuspensePageSkeleton({ variant = 'dashboard', className }: SuspensePageSkeletonProps) {
	if (variant === 'auth') {
		return (
			<div className={cn('min-h-screen grid grid-cols-1 lg:grid-cols-2', className)}>
				<div className='bg-[url(/png/bg_auth.png)] h-full flex lg:flex-col items-center justify-center bg-no-repeat bg-cover bg-bottom px-12 min-h-[200px]'>
					<div className='bg-brand-900 rounded-6xl lg:p-12 sm:p-6 p-3 w-full max-w-[460px]'>
						<Skeleton className='h-8 w-28 rounded-full bg-white/30' />
						<Skeleton className='mt-6 h-10 w-full rounded-2xl bg-white/20' />
					</div>
				</div>

				<div className='flex flex-col h-full sm:px-12 px-4 py-8'>
					<div className='flex sm:flex-row flex-col gap-4 items-center lg:justify-end justify-center'>
						<div className='flex items-center justify-center gap-2 flex-wrap'>
							<Skeleton className='h-10 w-32 rounded-full' />
							<Skeleton className='h-10 w-28 rounded-full' />
						</div>
					</div>
					<div className='flex flex-1 items-center justify-center'>
						<div className='w-full max-w-xl space-y-6'>
							<Skeleton className='mx-auto h-12 w-56 rounded-2xl' />
							<Skeleton className='h-11 w-full rounded-3xl' />
							<Skeleton className='h-11 w-full rounded-3xl' />
							<Skeleton className='h-11 w-full rounded-3xl' />
							<Skeleton className='h-11 w-full rounded-full' />
						</div>
					</div>
				</div>
			</div>
		)
	}

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
