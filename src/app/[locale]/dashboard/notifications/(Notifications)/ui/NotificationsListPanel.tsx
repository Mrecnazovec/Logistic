'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/ScrollArea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { formatDateTimeValue } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { Tag } from 'lucide-react'
import type { RefObject } from 'react'
import { NotificationsTab } from '../constants/notificationFilters'

type NotificationsListPanelProps = {
	t: (...args: any[]) => string
	isListLoading: boolean
	notificationsCount: number
	notificationsTab: NotificationsTab
	setNotificationsTab: (tab: NotificationsTab) => void
	importantCount: number
	activeNotifications: Array<{
		id: number
		title: string
		created_at?: string | null
		is_read?: boolean
	}>
	selectedId: number | null
	onSelect: (id: number, isRead?: boolean) => void
	listRef: RefObject<HTMLDivElement | null>
	sentinelRef: RefObject<HTMLDivElement | null>
	isFetchingNextPage: boolean
}

export function NotificationsListPanel({
	t,
	isListLoading,
	notificationsCount,
	notificationsTab,
	setNotificationsTab,
	importantCount,
	activeNotifications,
	selectedId,
	onSelect,
	listRef,
	sentinelRef,
	isFetchingNextPage,
}: NotificationsListPanelProps) {
	return (
		<div className='overflow-hidden rounded-2xl border bg-white shadow-sm'>
			<div className='flex items-center justify-between border-b px-4 py-3'>
				<p className='text-sm font-semibold'>{t('notifications.list.title')}</p>
				<p className='text-xs text-muted-foreground'>
					{isListLoading
						? t('notifications.list.loading')
						: t('notifications.list.total', { count: notificationsCount })}
				</p>
			</div>
			<div className='border-b px-4 py-2'>
				<Tabs value={notificationsTab} onValueChange={(value) => setNotificationsTab(value as NotificationsTab)}>
					<TabsList className='w-full'>
						<TabsTrigger value='all' className='flex-1'>
							{t('notifications.tabs.all', { count: notificationsCount })}
						</TabsTrigger>
						<TabsTrigger value='important' className='flex-1'>
							{t('notifications.tabs.important', { count: importantCount })}
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>
			<ScrollArea className='h-[580px]'>
				<div ref={listRef} className='max-h-full overflow-y-auto'>
					{activeNotifications.map((item) => (
						<button
							key={item.id}
							type='button'
							onClick={() => onSelect(item.id, item.is_read)}
							className={cn(
								'w-full border-b px-4 py-3 text-left last:border-b-0 transition-colors',
								item.id === selectedId ? 'border-l-4 border-l-brand bg-brand/10' : 'hover:bg-accent/50',
								!item.is_read && 'font-bold',
							)}
						>
							<p className='flex items-start gap-2 text-sm text-gray-900 line-clamp-2'>
								<Tag className='mt-0.5 size-4 text-brand' /> {item.title}
							</p>
							<p className='text-xs text-muted-foreground'>{formatDateTimeValue(item.created_at)}</p>
						</button>
					))}
					<div ref={sentinelRef} className='h-1' />
					{isFetchingNextPage && (
						<div className='py-3 text-center text-xs text-muted-foreground'>
							{t('notifications.list.loading')}
						</div>
					)}
					{activeNotifications.length === 0 && !isListLoading && (
						<div className='py-6 text-center text-sm text-muted-foreground'>{t('notifications.list.empty')}</div>
					)}
				</div>
				<ScrollBar />
			</ScrollArea>
		</div>
	)
}
