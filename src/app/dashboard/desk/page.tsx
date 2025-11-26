import { Metadata } from 'next'
import { Suspense } from 'react'
import { DeskPage } from './DeskPage'
import { LoaderTable } from '@/components/ui/table/TableStates'

export const metadata: Metadata = {
	title: 'Торговля'
}

export default function page() {
	return (
		<Suspense fallback={<LoaderTable />}>
			<DeskPage />
		</Suspense>
	)
}
