'use client'

import { useCarrierLocation } from './hooks/useCarrierLocation'
import { useStatusPage } from './hooks/useStatusPage'
import { StatusPageSkeleton } from './ui/StatusPageSkeleton'
import { StatusPageView } from './ui/StatusPageView'
import type { StatusPageProps } from './types'

export function StatusPage({ yandexApiKey, showMap = true }: StatusPageProps) {
	const state = useStatusPage()
	const carrierLocation = useCarrierLocation()
	const showLocationButton = carrierLocation.isCarrier && carrierLocation.permissionState === 'denied'

	return (
		<div className='flex h-full min-h-0 flex-col rounded-3xl bg-background p-4 sm:p-6 lg:p-8'>
			{showLocationButton ? (
				<div className='mb-4 flex items-center justify-between gap-3 rounded-2xl border border-warning-300 bg-warning-100/40 p-3'>
					<p className='text-sm text-foreground'>
						Доступ к геолокации заблокирован. Разрешите доступ в настройках браузера.
					</p>
				</div>
			) : null}
			{carrierLocation.isCarrier && carrierLocation.notice ? (
				<p className='mb-3 text-xs font-medium text-foreground'>{carrierLocation.notice}</p>
			) : null}
			{carrierLocation.isCarrier && carrierLocation.lastError && !showLocationButton ? (
				<p className='mb-3 text-xs text-muted-foreground'>{carrierLocation.lastError}</p>
			) : null}
			{state.isLoading || state.isLoadingOrder ? (
				<StatusPageSkeleton />
			) : (
				<StatusPageView
					t={state.t}
					locale={state.locale}
					order={state.order}
					apiKey={yandexApiKey}
					showMap={showMap}
					timelineSections={state.timelineSections}
					hasHistory={state.hasHistory}
					orderStatusLabel={state.orderStatusLabel}
					orderStatusVariant={state.orderStatusVariant}
				/>
			)}
		</div>
	)
}
