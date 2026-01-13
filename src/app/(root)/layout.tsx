import { MainLayout } from '@/components/layouts/main-layout/MainLayout'
import { PropsWithChildren } from 'react'

export default function layout({ children }: PropsWithChildren) {
	return <MainLayout>{children}</MainLayout>
}
