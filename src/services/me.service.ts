import { axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import { IMe, PatchedMeDto, UpdateMeDto } from '@/shared/types/Me.interface'

class MeService {
	async getMe() {
		return await axiosWithAuth<IMe>({
			url: API_URL.auth('me'),
			method: 'GET',
		})
	}

	async updateMe(data: UpdateMeDto) {
		return await axiosWithAuth<IMe>({
			url: API_URL.auth('me/update'),
			method: 'PUT',
			data,
		})
	}

	async patchMe(data: PatchedMeDto) {
		return await axiosWithAuth<IMe>({
			url: API_URL.auth('me/update'),
			method: 'PATCH',
			data,
		})
	}
}
export const meService = new MeService()
