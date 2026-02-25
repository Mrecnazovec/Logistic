'use client'

import { useSharedOrderPage } from '../hooks/useSharedOrderPage'
import { SharedOrderFinanceSection } from './SharedOrderFinanceSection'
import { SharedOrderPageSkeleton } from './SharedOrderPageSkeleton'
import { SharedOrderParticipantsGrid } from './SharedOrderParticipantsGrid'
import { SharedOrderStatusHeader } from './SharedOrderStatusHeader'
import { SharedOrderTripGrid } from './SharedOrderTripGrid'

export function SharedOrderPageView() {
	const {
		t,
		order,
		isLoading,
		statusLabel,
		statusVariant,
		driverStatusMeta,
		participantSections,
		loadingDocument,
		unloadingDocument,
	} = useSharedOrderPage()

	if (isLoading) return <SharedOrderPageSkeleton />

	if (!order || !loadingDocument || !unloadingDocument) {
		return (
			<div className='flex h-full w-full items-center justify-center rounded-4xl bg-background p-8 text-center text-muted-foreground'>
				{t('order.unavailable')}
			</div>
		)
	}

	return (
		<div className='space-y-6 rounded-4xl bg-background p-8'>
			<SharedOrderStatusHeader statusLabel={statusLabel} statusVariant={statusVariant} />
			<SharedOrderParticipantsGrid sections={participantSections} />
			<div className='h-px w-full bg-grayscale' />
			<SharedOrderTripGrid
				order={order}
				loadingDocument={loadingDocument}
				unloadingDocument={unloadingDocument}
				driverStatusMeta={driverStatusMeta}
				t={t}
			/>
			<div className='h-px w-full bg-grayscale' />
			<SharedOrderFinanceSection order={order} t={t} />
		</div>
	)
}
