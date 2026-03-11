'use client'

import { Button } from '@/components/ui/Button'
import { Bell, CheckCheck, RefreshCcw } from 'lucide-react'

type NotificationsHeaderProps = {
	t: (...args: any[]) => string
	unreadCount: number
	isListLoading: boolean
	isMarkingAllRead: boolean
	notificationsCount: number
	onRefresh: () => void
	onMarkAllRead: () => void
}

export function NotificationsHeader({
	t,
	unreadCount,
	isListLoading,
	isMarkingAllRead,
	notificationsCount,
	onRefresh,
	onMarkAllRead,
}: NotificationsHeaderProps) {
	return (
		<div className='flex flex-wrap items-center justify-between gap-3'>
			<div className='flex flex-wrap items-center gap-2'>
				<Bell className='size-5 text-brand' />
				<h1 className='text-2xl font-semibold'>{t('notifications.title')}</h1>
				{unreadCount > 0 && (
					<span className='rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700'>
						{t('notifications.unread', { count: unreadCount })}
					</span>
				)}
			</div>
			<div className='flex items-center gap-2'>
				<Button variant='ghost' size='sm' className='has-[>svg]:px-0' disabled={isListLoading} onClick={onRefresh}>
					<RefreshCcw className='size-4' />
					{t('notifications.actions.refresh')}
				</Button>
				<Button
					variant='ghost'
					size='sm'
					className='has-[>svg]:px-0'
					disabled={isMarkingAllRead || notificationsCount === 0 || isListLoading}
					onClick={onMarkAllRead}
				>
					<CheckCheck className='size-4' />
					{t('notifications.actions.markAllRead')}
				</Button>
			</div>
		</div>
	)
}
