import { axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import type { IPaginatedNotificationList } from '@/shared/types/Notification.interface'
import type { NotificationsMarkReadResponse } from '@/shared/types/Notifications.api'

class NotificationsService {
	async getNotifications(page?: number) {
		const { data } = await axiosWithAuth<IPaginatedNotificationList>({
			url: API_URL.root('notifications/'),
			method: 'GET',
			params: page ? { page } : undefined,
		})

		return data
	}

	async markRead(id: number) {
		const { data } = await axiosWithAuth<NotificationsMarkReadResponse>({
			url: API_URL.root(`notifications/${id}/mark-read/`),
			method: 'POST',
			data: { id },
		})

		return data
	}

	async markAllRead() {
		await axiosWithAuth<void>({
			url: API_URL.root('notifications/mark-all-read/'),
			method: 'POST',
		})
	}
}

export const notificationsService = new NotificationsService()
