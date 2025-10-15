import { PropsWithChildren } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export default function DashboardLayout({ children }: PropsWithChildren) {
	return (
		<div className='flex min-h-screen'>
			<Sidebar />

			<div className='flex-1 flex flex-col bg-[#F9FAFB]'>
				<Header />

				<main className="flex-1 p-6">
					{children}
				</main>
			</div>
		</div>
	)
}
