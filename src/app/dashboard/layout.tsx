import DashboardLayout from '@/components/layouts/dashboard-layout/DashboardLayout'
import { PropsWithChildren } from 'react'

export default function layout({ children }: PropsWithChildren) {
	return <DashboardLayout>{children}</DashboardLayout>
}
