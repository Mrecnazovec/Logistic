import type { Metadata } from 'next'
import { Suspense } from 'react'

import { LoaderTable } from '@/components/ui/table/TableStates'
import { IdProfile } from './IdProfile'

export const metadata: Metadata = {
	title: 'Профиль',
}

export default function page() {
	return (
		<Suspense fallback={<LoaderTable />}>
			<IdProfile />
		</Suspense>
	)
}