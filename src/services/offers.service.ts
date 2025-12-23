import { axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import type { operations } from '@/shared/types/api'
import {
	IOfferAcceptResponse,
	IOfferCounter,
	IOfferDetail,
	IOfferInvite,
	IOfferRejectResponse,
	OfferCreateDto,
} from '@/shared/types/Offer.interface'
import {
	IPaginatedOfferShortList,
	IPaginatedOfferStatusLogList,
} from '@/shared/types/PaginatedList.interface'

type OffersListQuery = operations['offers_list']['parameters']['query']
type OffersLogsQuery = operations['offers_logs_list']['parameters']['query']

class OffersService {
	/* GET */

	async getOffers(params?: OffersListQuery) {
		const { data } = await axiosWithAuth<IPaginatedOfferShortList>({
			url: API_URL.offers(),
			method: 'GET',
			params,
		})

		return data
	}

	async getOfferById(id: string) {
		const { data } = await axiosWithAuth<IOfferDetail>({
			url: API_URL.offers(`${id}`),
			method: 'GET',
		})

		return data
	}

	async getOfferLogs(id: string, params?: OffersLogsQuery) {
		const { data } = await axiosWithAuth<IPaginatedOfferStatusLogList>({
			url: API_URL.offers(`${id}/logs/`),
			method: 'GET',
			params,
		})

		return data
	}

	async getIncomingOffers(page?: string) {
		const { data } = await axiosWithAuth<IPaginatedOfferShortList>({
			url: API_URL.offers('incoming'),
			method: 'GET',
			params: { page },
		})

		return data
	}

	async getMyOffers(page?: string) {
		const { data } = await axiosWithAuth<IPaginatedOfferShortList>({
			url: API_URL.offers('my'),
			method: 'GET',
			params: { page },
		})

		return data
	}

	/* POST */

	async createOffer(data: OfferCreateDto) {
		const { data: createdOffer } = await axiosWithAuth<IOfferDetail>({
			url: API_URL.offers(),
			method: 'POST',
			data,
		})

		return createdOffer
	}

	async acceptOffer(id: string) {
		const { data } = await axiosWithAuth<IOfferAcceptResponse>({
			url: API_URL.offers(`${id}/accept/`),
			method: 'POST',
		})
		return data
	}

	async counterOffer(id: string, data: IOfferCounter) {
		const { data: counterOffer } = await axiosWithAuth<IOfferAcceptResponse>({
			url: API_URL.offers(`${id}/counter/`),
			method: 'POST',
			data,
		})
		return counterOffer
	}

	async rejectOffer(id: string) {
		const { data } = await axiosWithAuth<IOfferRejectResponse>({
			url: API_URL.offers(`${id}/reject/`),
			method: 'POST',
		})
		return data
	}

	async inviteOffer(data: IOfferInvite) {
		const { data: inviteOffer } = await axiosWithAuth<IOfferDetail>({
			url: API_URL.offers('invite/'),
			method: 'POST',
			data,
		})
		return inviteOffer
	}

	/* PUT */
	/* DELETE */

	async deleteOffer(id: string) {
		return axiosWithAuth<void>({
			url: API_URL.offers(`${id}`),
			method: 'DELETE',
		})
	}
}
export const offerService = new OffersService()
