import { axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import { AgreementsListQuery, IAgreement, IPaginatedAgreementList } from '@/shared/types/Agreement.interface'

class AgreementsService {
	/* GET */

	async getAgreements(params?: AgreementsListQuery) {
		const { data } = await axiosWithAuth<IPaginatedAgreementList>({
			url: API_URL.agreements('agreements/'),
			method: 'GET',
			params,
		})

		return data
	}

	async getAgreement(id: string | number) {
		const { data } = await axiosWithAuth<IAgreement>({
			url: API_URL.agreements(`agreements/${id}/`),
			method: 'GET',
		})

		return data
	}

	/* POST */

	async acceptAgreement(id: string | number) {
		return axiosWithAuth<void>({
			url: API_URL.agreements(`agreements/${id}/accept/`),
			method: 'POST',
		})
	}

	async rejectAgreement(id: string | number) {
		return axiosWithAuth<void>({
			url: API_URL.agreements(`agreements/${id}/reject/`),
			method: 'POST',
		})
	}
}

export const agreementsService = new AgreementsService()
