import type { Dispatch, SetStateAction } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { CargoPublishRequestDto, ICargoPublish } from '@/shared/types/CargoPublish.interface'
import type { IMe } from '@/shared/types/Me.interface'
import type { CityCoordinates } from '@/shared/types/Nominatim.interface'

export type EditPoint = {
	lat: number
	lng: number
}

export type EditFormMapState = {
	originCityCoordinates: CityCoordinates | null
	setOriginCityCoordinates: Dispatch<SetStateAction<CityCoordinates | null>>
	destinationCityCoordinates: CityCoordinates | null
	setDestinationCityCoordinates: Dispatch<SetStateAction<CityCoordinates | null>>
	originExactCoordinates: EditPoint | null
	setOriginExactCoordinates: Dispatch<SetStateAction<EditPoint | null>>
	destinationExactCoordinates: EditPoint | null
	setDestinationExactCoordinates: Dispatch<SetStateAction<EditPoint | null>>
	originCity: string
	originAddress: string
	destinationCity: string
	destinationAddress: string
}

export type EditFormContentProps = {
	form: UseFormReturn<CargoPublishRequestDto>
	onSubmit: (data: CargoPublishRequestDto) => void
	isLoadingPatch: boolean
	load: ICargoPublish | undefined
	me: IMe | undefined
	originCountryValue?: string
	destinationCountryValue?: string
	originCityLabel?: string
	destinationCityLabel?: string
	yandexApiKey?: string
}

export type EditSectionCommonProps = {
	form: UseFormReturn<CargoPublishRequestDto>
	isLoadingPatch: boolean
}
