import { Metadata } from "next"
import { Suspense } from "react"
import { IdProfile } from "./IdProfile"
import { LoaderTable } from "@/components/ui/table/TableStates"

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
