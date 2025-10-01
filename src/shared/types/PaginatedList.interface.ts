import { ICargoList } from './CargoList.interface'
import { IOfferShort } from './Offer.interface'

export interface IPaginatedCargoListList {
	count: number
	next?: string | null
	previous?: string | null
	result: ICargoList[]
}

export interface IPaginatedOfferShortList {
	count: number
	next?: string | null
	previous?: string | null
	result: IOfferShort[]
}
