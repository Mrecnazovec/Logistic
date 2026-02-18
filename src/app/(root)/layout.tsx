import { MainLayout } from '@/components/layouts/main-layout/MainLayout'
import { PropsWithChildren } from 'react'

export default function RootLayout({ children }: PropsWithChildren) {
	return <MainLayout>{children}</MainLayout>
}
