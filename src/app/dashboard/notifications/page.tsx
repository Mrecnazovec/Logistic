import { Metadata } from 'next'
import { Suspense } from 'react'
import { Notifications } from './Notifications'
import { LoaderTable } from '@/components/ui/table/TableStates'

export const metadata: Metadata = {
    title: 'Уведомления',
}

export default function page() {
    return (
        <Suspense fallback={<LoaderTable />}>
            <Notifications />
        </Suspense>
    )
}
