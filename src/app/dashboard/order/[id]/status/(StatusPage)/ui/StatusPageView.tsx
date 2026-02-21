'use client'

import { getOrderDriverStatusName, type OrderDriverStatusEnum } from '@/shared/enums/OrderStatus.enum'
import { useCallback, useState } from 'react'
import { AVERAGE_SPEED_KMH, DRIVER_STATUS_BADGE_MAP, getLocaleTag, getProgressPercent, getProgressPlaceholderKey, getRouteCities, normalizeOrderStatus } from '../lib/statusView.helpers'
import type { StatusPageViewProps } from '../types'
import { OrderRouteMap } from './OrderRouteMap'
import { StatusCarrierCard } from './StatusCarrierCard'
import { StatusProgressCard } from './StatusProgressCard'
import { StatusTimelineFeed } from './StatusTimelineFeed'
import { TemporaryDriverStatusBranches } from './TemporaryDriverStatusBranches'

export function StatusPageView({
	t,
	locale,
	order,
	apiKey,
	showMap = true,
	timelineSections,
	hasHistory,
	orderStatusLabel,
	orderStatusVariant,
	carrierCurrentPosition,
}: StatusPageViewProps) {
	const [remainingKmFromMap, setRemainingKmFromMap] = useState<number | null>(null)
	const [driverLocationFromMap, setDriverLocationFromMap] = useState<string | null>(null)

	const handleRemainingKmChange = useCallback((nextValue: number | null) => {
		setRemainingKmFromMap(nextValue)
	}, [])
	const handleDriverLocationChange = useCallback((nextValue: string | null) => {
		setDriverLocationFromMap(nextValue)
	}, [])

	if (!showMap) {
		return <TemporaryDriverStatusBranches t={t} timelineSections={timelineSections} hasHistory={hasHistory} />
	}

	const latestEvent = timelineSections[0]?.events[0] ?? null
	const normalizedStatus = normalizeOrderStatus(String(order?.status ?? ''))
	const progressPercent = getProgressPercent(normalizedStatus)
	const canShowProgress = progressPercent !== null
	const progressPlaceholderKey = getProgressPlaceholderKey(normalizedStatus)
	const routeCities = getRouteCities(order)
	const viaCities = routeCities.length > 2 ? routeCities.slice(1, -1) : []
	const remainingHours = remainingKmFromMap !== null ? Math.max(1, Math.ceil(remainingKmFromMap / AVERAGE_SPEED_KMH)) : null
	const remainingKmLabel =
		remainingKmFromMap !== null ? `${remainingKmFromMap.toFixed(1)} ${t('order.unit.km')}` : t('order.status.timeline.notSpecified')

	const carrierName = order?.roles?.carrier?.name?.trim() || t('order.status.timeline.system')
	const carrierId = order?.roles?.carrier?.id
	const currentDriverStatus = order?.driver_status as OrderDriverStatusEnum | undefined
	const driverStatusMeta = currentDriverStatus ? DRIVER_STATUS_BADGE_MAP[currentDriverStatus] : null
	const carrierStatusLabel =
		(currentDriverStatus ? getOrderDriverStatusName(t, currentDriverStatus) : '') || driverStatusMeta?.fallback || orderStatusLabel

	const carrierLocation = driverLocationFromMap?.trim()
		? driverLocationFromMap
		: carrierCurrentPosition
			? `${carrierCurrentPosition.lat.toFixed(5)}, ${carrierCurrentPosition.lng.toFixed(5)}`
			: order?.origin_city?.trim() || t('order.status.progress.locationUnknown')

	const updatedAtSource = carrierCurrentPosition?.capturedAt ?? latestEvent?.occurredAt ?? null
	const updatedAt = updatedAtSource
		? new Intl.DateTimeFormat(getLocaleTag(locale), {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			}).format(new Date(updatedAtSource))
		: t('order.status.timeline.unknownTime')

	return (
		<div className='grid h-full min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-6'>
			<OrderRouteMap
				order={order}
				apiKey={apiKey}
				locale={locale}
				onRemainingKmChange={handleRemainingKmChange}
				onDriverLocationChange={handleDriverLocationChange}
			/>

			<section className='flex h-full min-h-0 flex-col gap-3'>
				<StatusProgressCard
					t={t}
					orderStatusLabel={orderStatusLabel}
					orderStatusVariant={orderStatusVariant}
					routeCities={routeCities}
					canShowProgress={canShowProgress}
					progressPercent={progressPercent}
					progressPlaceholderKey={progressPlaceholderKey}
					remainingHours={remainingHours}
					viaCities={viaCities}
				/>

				<StatusCarrierCard
					t={t}
					carrierStatusLabel={carrierStatusLabel}
					carrierStatusVariant={driverStatusMeta?.variant ?? orderStatusVariant}
					carrierId={carrierId}
					carrierName={carrierName}
					carrierLocation={carrierLocation}
					remainingKmLabel={remainingKmLabel}
					updatedAt={updatedAt}
				/>

				<StatusTimelineFeed t={t} timelineSections={timelineSections} hasHistory={hasHistory} />
			</section>
		</div>
	)
}

