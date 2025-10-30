import DashboardLayout from '@/components/layouts/dashboard-layout/DashboardLayout'
import { PropsWithChildren, Suspense } from 'react'

export default function layout({ children }: PropsWithChildren) {
	return <Suspense>
		<DashboardLayout>{children}</DashboardLayout>
	</Suspense>
}
