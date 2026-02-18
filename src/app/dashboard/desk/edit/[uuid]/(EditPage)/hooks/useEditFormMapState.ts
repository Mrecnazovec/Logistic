'use client'

import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { CargoPublishRequestDto } from '@/shared/types/CargoPublish.interface'
import type { CityCoordinates } from '@/shared/types/Nominatim.interface'
import type { EditFormMapState, EditPoint } from '../types/EditForm.types'

export const useEditFormMapState = (form: UseFormReturn<CargoPublishRequestDto>): EditFormMapState => {
	const [originCityCoordinates, setOriginCityCoordinates] = useState<CityCoordinates | null>(null)
	const [destinationCityCoordinates, setDestinationCityCoordinates] = useState<CityCoordinates | null>(null)
	const [originExactCoordinates, setOriginExactCoordinates] = useState<EditPoint | null>(null)
	const [destinationExactCoordinates, setDestinationExactCoordinates] = useState<EditPoint | null>(null)
	const originCity = form.watch('origin_city') ?? ''
	const originAddress = form.watch('origin_address') ?? ''
	const destinationCity = form.watch('destination_city') ?? ''
	const destinationAddress = form.watch('destination_address') ?? ''

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

