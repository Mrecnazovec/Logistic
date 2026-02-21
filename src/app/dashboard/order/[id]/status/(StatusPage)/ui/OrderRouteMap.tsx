'use client'

import { useOrderRouteMap } from '../hooks/useOrderRouteMap'
import type { OrderRouteMapProps } from '../types'
import { MapTouchHintOverlay } from './MapTouchHintOverlay'

export function OrderRouteMap({ order, apiKey, locale, onRemainingKmChange, onDriverLocationChange }: OrderRouteMapProps) {
	const { setContainerNode, mapError, isLoadingMap, isTouchDevice, showTouchHint, setShowTouchHint, touchHintLabel } = useOrderRouteMap({
		order,
		apiKey,
		locale,
		onRemainingKmChange,
		onDriverLocationChange,
	})

	return (
		<section className='relative h-full min-h-[500px] overflow-hidden rounded-3xl border bg-muted/30'>
			<div ref={setContainerNode} className='h-full w-full' />

			{isTouchDevice && showTouchHint && !mapError ? (
				<MapTouchHintOverlay
					label={touchHintLabel}
					onDismiss={() => {
						setShowTouchHint(false)
					}}
				/>
			) : null}

			{isLoadingMap ? (
				<div className='absolute inset-0 grid place-items-center bg-background/40 text-sm text-muted-foreground'>Loading map...</div>
			) : null}

			{mapError ? (
				<div className='absolute inset-0 grid place-items-center bg-background/70 p-4 text-center text-sm text-destructive'>{mapError}</div>
			) : null}
		</section>
	)
}

