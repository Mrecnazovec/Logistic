import { axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import type { SupportTicketCreateDto } from '@/shared/types/Support.interface'

class SupportService {
	async createSupportTicket(data: SupportTicketCreateDto) {
		return axiosWithAuth<void>({
			url: API_URL.support(),
			method: 'POST',
			data,
		})
	}
}

export const supportService = new SupportService()
