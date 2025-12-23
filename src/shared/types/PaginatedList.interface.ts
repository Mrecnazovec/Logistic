import type { components } from './api'
import type { IOrderList } from './Order.interface'

export type IPaginatedAgreementList = components['schemas']['PaginatedAgreementListList']
export type IPaginatedCargoListList = components['schemas']['PaginatedCargoListList']
export type IPaginatedOfferShortList = components['schemas']['PaginatedOfferShortList']
export type IPaginatedOfferStatusLogList = components['schemas']['PaginatedOfferStatusLogList']
export type IPaginatedOrderListList = Omit<components['schemas']['PaginatedOrderListList'], 'results'> & {
	results: IOrderList[]
}
export type IPaginatedUserRatingList = components['schemas']['PaginatedUserRatingList']
