import { axiosWithAuth } from '@/api/api.interceptors'

import { API_URL } from '@/config/api.config'
import { CargoPublishRequestDto, ICargoPublish, PatchedCargoPublishDto } from '@/shared/types/CargoPublish.interface'
import { IPaginatedCargoListList } from '@/shared/types/PaginatedList.interface'
import { IRefreshResponse } from '@/shared/types/Registration.interface'
import { ISearch } from '@/shared/types/Search.interface'

class LoadsService {
	/* GET */

	async getLoad(uuid: string) {
		const { data } = await axiosWithAuth<ICargoPublish>({
			url: API_URL.loads(`${uuid}`),
			method: 'GET',
		})

		return data
	}

	async getLoadsBoard() {
		const { data } = await axiosWithAuth<IPaginatedCargoListList>({
			url: API_URL.loads('board'),
			method: 'GET',
		})

		return data
	}

	async getLoadsMine() {
		const { data } = await axiosWithAuth<IPaginatedCargoListList>({
			url: API_URL.loads('mine'),
			method: 'GET',
		})

		return data
	}

	async getLoadsPublic(params?: ISearch) {
		const { data } = await axiosWithAuth<IPaginatedCargoListList>({
			url: API_URL.loads('public'),
			method: 'GET',
			params,
		})

		return data
	}

	/* POST */

	async cancelLoad(id: string, detail: string) {
		const { data } = await axiosWithAuth<IRefreshResponse>({
			url: API_URL.loads(`${id}/cancel`),
			method: 'POST',
			data: { detail },
		})

		return data
	}

	async refreshLoad(uuid: string, detail: string) {
		const { data } = await axiosWithAuth<IRefreshResponse>({
			url: API_URL.loads(`${uuid}/refresh`),
			method: 'POST',
			data: { detail },
		})

		return data
	}

	async createLoad(data: CargoPublishRequestDto) {
		const { data: createdLoad } = await axiosWithAuth<ICargoPublish>({
			url: API_URL.loads('create'),
			method: 'POST',
			data,
		})

		return createdLoad
	}

	/* PUT */

	async putLoad(id: string, data: CargoPublishRequestDto) {
		const { data: putLoad } = await axiosWithAuth<ICargoPublish>({
			url: API_URL.loads(`${id}`),
			method: 'PUT',
			data,
		})

		return putLoad
	}

	/* PATCH */

	async patchLoad(id: string, data: PatchedCargoPublishDto) {
		const { data: patchedLoad } = await axiosWithAuth<ICargoPublish>({
			url: API_URL.loads(`${id}`),
			method: 'PATCH',
			data,
		})

		return patchedLoad
	}
}

export const loadsService = new LoadsService()
