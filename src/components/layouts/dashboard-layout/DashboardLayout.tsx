'use client'

import { Skeleton } from '@/components/ui/Skeleton'
import { PropsWithChildren, Suspense } from 'react'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'
import { useLoadsPublicRealtime } from '@/hooks/queries/loads/useLoadsPublicRealtime'

function DashboardSidebarSkeleton() {
	return (
		<aside className='hidden md:flex w-[8vw] max-w-32 shrink-0 bg-brand-900 text-white flex-col rounded-tr-[42px] rounded-br-xl pt-8 md:sticky md:top-0 md:h-screen md:z-20'>
			<div className='flex justify-center px-4'>
				<Skeleton className='h-9 w-10 rounded-xl bg-white/15' />
			</div>
			<div className='mt-8 flex flex-1 flex-col items-center gap-2'>
				<div className='flex w-full flex-col items-center gap-2'>
					{Array.from({ length: 7 }).map((_, index) => (
						<div key={index} className='flex w-full justify-center'>
							<Skeleton className='h-11 w-[70%] rounded-2xl bg-white/15' />
						</div>
					))}
				</div>
			</div>
		</aside>
	)
}

function DashboardHeaderSkeleton() {
	return (
		<div className='h-auto md:min-h-24 bg-white border-b shadow-lg px-3 md:px-10 py-3'>
			<div className='flex justify-between gap-4 md:min-h-[72px] md:items-stretch'>
				<div className='flex flex-1 flex-col justify-end self-stretch space-y-3'>
					<Skeleton className='h-5 w-40 rounded-full' />
					<div className='flex gap-3'>
						<Skeleton className='h-4 w-24 rounded-full' />
						<Skeleton className='h-4 w-24 rounded-full' />
						<Skeleton className='h-4 w-24 rounded-full' />
					</div>
				</div>
				<div className='flex items-center gap-3 self-center'>
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
