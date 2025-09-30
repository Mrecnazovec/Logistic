import { ICargoList } from './CargoList.interface'
import { IOfferShort } from './Offer.interface'

export interface PaginatedCargoListList {
	count: number
	next?: string | null
	previous?: string | null
	result: ICargoList[]
}

export interface PaginatedOfferShortList {
	count: number
	next?: string | null
	previous?: string | null
	result: IOfferShort[]
}
