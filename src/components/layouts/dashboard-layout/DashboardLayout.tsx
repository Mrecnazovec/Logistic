import { PropsWithChildren } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export default function DashboardLayout({ children }: PropsWithChildren) {
	return (
		<>
			<Header />
			<Sidebar />
			<main>{children}</main>
		</>
	)
}
