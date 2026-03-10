'use client'

import { Card } from '@/components/ui/Card'
import { useNotificationsPage } from './hooks/useNotificationsPage'
import { NotificationsDetailsPanel } from './ui/NotificationsDetailsPanel'
import { NotificationsHeader } from './ui/NotificationsHeader'
import { NotificationsListPanel } from './ui/NotificationsListPanel'

export function Notifications() {
	const state = useNotificationsPage()

	return (
		<div className='flex h-full flex-col gap-4 xs:px-2 xs:py-4 md:px-6 lg:px-8'>
			<NotificationsHeader
				t={state.t}
				unreadCount={state.unreadCount}
				isListLoading={state.isListLoading}
				isMarkingAllRead={state.isMarkingAllRead}
				notificationsCount={state.notifications.length}
				onRefresh={state.refetchNotifications}
				onMarkAllRead={state.markAllRead}
			/>

			<Card className='grid h-full grid-cols-1 gap-4 rounded-4xl p-4 lg:grid-cols-[340px_1fr]'>
				<NotificationsListPanel
					t={state.t}
					isListLoading={state.isListLoading}
					notificationsCount={state.notifications.length}
					notificationsTab={state.notificationsTab}
					setNotificationsTab={state.setNotificationsTab}
					importantCount={state.importantNotifications.length}
					activeNotifications={state.activeNotifications}
					selectedId={state.selectedId}
					onSelect={state.handleSelect}
					listRef={state.listRef}
					sentinelRef={state.sentinelRef}
					isFetchingNextPage={state.isFetchingNextPage}
				/>

				<NotificationsDetailsPanel
					selectedNotification={state.selectedNotification}
					isListLoading={state.isListLoading}
					t={state.t}
				/>
			</Card>
		</div>
	)
}
