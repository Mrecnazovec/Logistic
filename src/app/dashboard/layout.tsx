import DashboardLayout from '@/components/layouts/dashboard-layout/DashboardLayout'
import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
	...NO_INDEX_PAGE
}


export default function layout({ children }: PropsWithChildren) {
	return <DashboardLayout>{children}</DashboardLayout>
}
