'use client'

import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { CargoPublishRequestDto } from '@/shared/types/CargoPublish.interface'
import type { CityCoordinates } from '@/shared/types/Nominatim.interface'
import type { EditFormMapState } from '../types/EditForm.types'

export const useEditFormMapState = (form: UseFormReturn<CargoPublishRequestDto>): EditFormMapState => {
	const [originCityCoordinates, setOriginCityCoordinates] = useState<CityCoordinates | null>(null)
	const [destinationCityCoordinates, setDestinationCityCoordinates] = useState<CityCoordinates | null>(null)
	const originCity = form.watch('origin_city') ?? ''
	const originAddress = form.watch('origin_address') ?? ''
	const destinationCity = form.watch('destination_city') ?? ''
	const destinationAddress = form.watch('destination_address') ?? ''
	const originLat = form.watch('origin_lat')
	const originLng = form.watch('origin_lng')
	const destLat = form.watch('dest_lat')
	const destLng = form.watch('dest_lng')

	const originExactCoordinates =
		typeof originLat === 'number' && typeof originLng === 'number' ? { lat: originLat, lng: originLng } : null
	const destinationExactCoordinates =
		typeof destLat === 'number' && typeof destLng === 'number' ? { lat: destLat, lng: destLng } : null

	const setOriginExactCoordinates: EditFormMapState['setOriginExactCoordinates'] = (nextValue) => {
		const resolvedValue =
			typeof nextValue === 'function' ? nextValue(originExactCoordinates) : nextValue
		form.setValue('origin_lat', resolvedValue?.lat, { shouldDirty: true })
		form.setValue('origin_lng', resolvedValue?.lng, { shouldDirty: true })
	}

	const setDestinationExactCoordinates: EditFormMapState['setDestinationExactCoordinates'] = (nextValue) => {
		const resolvedValue =
			typeof nextValue === 'function' ? nextValue(destinationExactCoordinates) : nextValue
		form.setValue('dest_lat', resolvedValue?.lat, { shouldDirty: true })
		form.setValue('dest_lng', resolvedValue?.lng, { shouldDirty: true })
	}

	return {
		originCityCoordinates,
		setOriginCityCoordinates,
		destinationCityCoordinates,
		setDestinationCityCoordinates,
		originExactCoordinates,
		setOriginExactCoordinates,
		destinationExactCoordinates,
		setDestinationExactCoordinates,
		originCity,
		originAddress,
		destinationCity,
		destinationAddress,
	}
}
