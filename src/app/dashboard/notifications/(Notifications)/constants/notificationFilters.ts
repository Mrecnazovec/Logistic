import { notificationTypeSamples } from '@/app/dashboard/notifications/notificationTypes'

export type NotificationsTab = 'all' | 'important'

export const IMPORTANT_NOTIFICATION_TYPES = new Set<string>(
	notificationTypeSamples.filter((item) => item.importance).map((item) => item.type),
)
