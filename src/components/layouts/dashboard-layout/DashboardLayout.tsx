'use client'

import { PropsWithChildren } from 'react'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'
import { useLoadsPublicRealtime } from '@/hooks/queries/loads/useLoadsPublicRealtime'

export default function DashboardLayout({ children }: PropsWithChildren) {
	useLoadsPublicRealtime()

	return (
		<div className='flex min-h-screen'>
			<Sidebar />

			<div className='w-[90vw] flex-1 flex flex-col bg-[#F9FAFB]'>
				<Header />

				<main className='flex-1 p-6 max-md:pb-32'>
					{children}
				</main>

				<MobileNav />
			</div>
		</div>
	)
}
