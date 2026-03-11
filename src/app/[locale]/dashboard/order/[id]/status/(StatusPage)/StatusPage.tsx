'use client'

import { useStatusPage } from './hooks/useStatusPage'
import { StatusPageSkeleton } from './ui/StatusPageSkeleton'
import { StatusPageView } from './ui/StatusPageView'
import type { StatusPageProps } from './types'

export function StatusPage({ yandexApiKey }: StatusPageProps) {
	const state = useStatusPage()

	return (
		<div className='flex h-full min-h-0 flex-col rounded-3xl bg-background p-4 sm:p-6 lg:p-8'>
			{state.isLoading || state.isLoadingOrder ? (
				<StatusPageSkeleton />
			) : (
				<StatusPageView
					t={state.t}
					locale={state.locale}
					order={state.order}
					apiKey={yandexApiKey}
					timelineSections={state.timelineSections}
					hasHistory={state.hasHistory}
					orderStatusLabel={state.orderStatusLabel}
					orderStatusVariant={state.orderStatusVariant}
				/>
			)}
		</div>
	)
}
