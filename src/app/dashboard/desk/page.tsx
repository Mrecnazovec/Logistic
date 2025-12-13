import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoaderTable } from '@/components/ui/table/TableStates'
import { DeskPage } from './DeskPage'

export const metadata: Metadata = {
	title: 'Торговля',
}

export default function page() {
	return (
		<Suspense fallback={<LoaderTable />}>
			<DeskPage />
		</Suspense>
	)
}
