'use client'

import { Skeleton } from '@/components/ui/Skeleton'
import { PropsWithChildren, Suspense } from 'react'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'
import { useLoadsPublicRealtime } from '@/hooks/queries/loads/useLoadsPublicRealtime'

function DashboardSidebarSkeleton() {
	return <div className='hidden md:block w-[8vw] max-w-32 shrink-0 bg-brand-900' />
}

function DashboardHeaderSkeleton() {
	return (
		<div className='h-auto md:min-h-24 bg-white border-b shadow-lg px-3 md:px-10 py-3'>
			<div className='flex items-center justify-between gap-4'>
				<div className='flex-1 space-y-3'>
					<Skeleton className='h-5 w-40 rounded-full' />
					<div className='flex gap-3'>
						<Skeleton className='h-4 w-24 rounded-full' />
						<Skeleton className='h-4 w-24 rounded-full' />
						<Skeleton className='h-4 w-24 rounded-full' />
					</div>
				</div>
				<div className='flex items-center gap-3'>
					<Skeleton className='size-9 rounded-2xl' />
					<Skeleton className='h-10 w-32 rounded-full' />
				</div>
			</div>
		</div>
	)
}

function DashboardMobileNavSkeleton() {
	return (
		<div className='md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-2 py-2'>
			<div className='grid grid-cols-5 gap-2'>
				{Array.from({ length: 5 }).map((_, index) => (
					<div key={index} className='flex flex-col items-center gap-1'>
						<Skeleton className='size-11 rounded-2xl' />
						<Skeleton className='h-1 w-8 rounded-full' />
					</div>
				))}
			</div>
		</div>
	)
}

export default function DashboardLayout({ children }: PropsWithChildren) {
	useLoadsPublicRealtime()

	return (
		<div className='flex min-h-screen'>
			<Suspense fallback={<DashboardSidebarSkeleton />}>
				<Sidebar />
			</Suspense>

			<div className='w-[90vw] flex-1 flex flex-col bg-[#F9FAFB]'>
				<Suspense fallback={<DashboardHeaderSkeleton />}>
					<Header />
				</Suspense>

				<main className='flex-1 p-6 max-md:pb-32'>
					{children}
				</main>

				<Suspense fallback={<DashboardMobileNavSkeleton />}>
					<MobileNav />
				</Suspense>
			</div>
		</div>
	)
}
