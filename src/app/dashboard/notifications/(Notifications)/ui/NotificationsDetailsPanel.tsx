'use client'

import { Loader } from '@/components/ui/Loader'
import { NotificationDetails } from '@/app/dashboard/notifications/NotificationDetails'
import type { INotification } from '@/shared/types/Notification.interface'

type NotificationsDetailsPanelProps = {
	selectedNotification?: INotification
	isListLoading: boolean
	t: (...args: any[]) => string
}

export function NotificationsDetailsPanel({ selectedNotification, isListLoading, t }: NotificationsDetailsPanelProps) {
	return (
		<div className='min-h-[320px] rounded-2xl border bg-white p-5 shadow-sm'>
			{selectedNotification ? (
				<NotificationDetails notification={selectedNotification} />
			) : (
				<div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
					{isListLoading ? <Loader /> : t('notifications.details.empty')}
				</div>
			)}
		</div>
	)
}
