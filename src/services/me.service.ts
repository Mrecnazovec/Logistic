import { axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import {
	IMe,
	PatchedMeDto,
	SendEmailVerifyFromProfileDto,
	SendEmailVerifyFromProfileResponse,
	UpdateMeDto,
	VerifyEmailFromProfileDto,
	VerifyEmailFromProfileResponse,
} from '@/shared/types/Me.interface'
import { IAnalytics } from '@/shared/types/Analytics.interface'

class MeService {

	/* GET */

	async getMe() {
		const { data } = await axiosWithAuth<IMe>({
			url: API_URL.auth('me'),
			method: 'GET',
		})

		return data
	}

	async getAnalytics() {
		const { data } = await axiosWithAuth<IAnalytics>({
			url: API_URL.auth('me/analytics'),
			method: 'GET',
		})

		return data
	}

	/* PUT & PATCH */

	async updateMe(data: UpdateMeDto) {
		const { data: updatedMe } = await axiosWithAuth<IMe>({
			url: API_URL.auth('me/update'),
			method: 'PUT',
			data,
		})

		return updatedMe
	}

	async patchMe(data: PatchedMeDto) {
		const { data: patchedMe } = await axiosWithAuth<IMe>({
			url: API_URL.auth('me/update'),
			method: 'PATCH',
			data,
		})

		return patchedMe
	}

	/* Email verify */

	async sendEmailVerifyFromProfile(data: SendEmailVerifyFromProfileDto) {
		const { data: result } = await axiosWithAuth<SendEmailVerifyFromProfileResponse>({
			url: API_URL.auth('me/email/send'),
			method: 'POST',
			data,
		})

		return result
	}

	async verifyEmailFromProfile(data: VerifyEmailFromProfileDto) {
		const { data: result } = await axiosWithAuth<VerifyEmailFromProfileResponse>({
			url: API_URL.auth('me/email/verify'),
			method: 'POST',
			data,
		})

		return result
	}
}
export const meService = new MeService()
