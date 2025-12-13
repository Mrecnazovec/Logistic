import { Metadata } from 'next'
import { Suspense } from 'react'
import { HistoryPage } from './HistoryPage'
import { LoaderTable } from '@/components/ui/table/TableStates'

export const metadata: Metadata = {
    title: 'История',
}

export default function page() {
    return (
        <Suspense fallback={<LoaderTable />}>
            <HistoryPage />
        </Suspense>
    )
}
