"use client"

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { ScrollArea, ScrollBar } from '@/components/ui/ScrollArea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { notificationTypeSamples } from '@/app/dashboard/notifications/notificationTypes'
import { NotificationDetails } from '@/app/dashboard/notifications/NotificationDetails'
import { useNotifications } from '@/hooks/queries/notifications/useNotifications'
import { useI18n } from '@/i18n/I18nProvider'
import { cn } from '@/lib/utils'
import { formatDateTimeValue } from '@/lib/formatters'
import { Bell, CheckCheck, RefreshCcw, Tag } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

const IMPORTANT_NOTIFICATION_TYPES = new Set<string>(
	notificationTypeSamples.filter((item) => item.importance).map((item) => item.type)
)

export function Notifications() {
	const {
		notifications,
		refetchNotifications,
		isLoadingNotifications,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		markRead,
		markAllRead,
		isMarkingAllRead,
		isNotificationsEnabled,
	} = useNotifications(true)

	const { t } = useI18n()
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()
	const listRef = useRef<HTMLDivElement | null>(null)
	const sentinelRef = useRef<HTMLDivElement | null>(null)
	const [notificationsTab, setNotificationsTab] = useState<'all' | 'important'>('all')

	const selectedId = useMemo(() => {
		const param = searchParams.get('id')
		if (param) return Number(param)
		return notifications[0]?.id ?? null
	}, [notifications, searchParams])

	useEffect(() => {
		if (selectedId === null || !pathname) return
		const currentParam = searchParams.get('id')
		if (!currentParam) router.replace(`${pathname}?id=${selectedId}`)
	}, [pathname, router, searchParams, selectedId])

	useEffect(() => {
		if (selectedId === null || !isNotificationsEnabled) return
		const match = notifications.find((item) => item.id === selectedId)
		if (match) {
			if (!match.is_read) markRead(match.id)
			return
		}
		if (hasNextPage && !isFetchingNextPage) fetchNextPage()
		else if (!hasNextPage && !isLoadingNotifications && !isFetchingNextPage) refetchNotifications()
	}, [
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoadingNotifications,
		isNotificationsEnabled,
		markRead,
		notifications,
		refetchNotifications,
		selectedId,
	])

	useEffect(() => {
		const root = listRef.current
		const sentinel = sentinelRef.current
		if (!root || !sentinel) return

		const observer = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting) && hasNextPage && !isFetchingNextPage) fetchNextPage()
		}, { root, rootMargin: '0px', threshold: 1 })

		observer.observe(sentinel)
		return () => observer.disconnect()
	}, [fetchNextPage, hasNextPage, isFetchingNextPage])

	const selectedNotification = useMemo(() => notifications.find((item) => item.id === selectedId), [notifications, selectedId])
	const unreadCount = useMemo(() => notifications.filter((item) => !item.is_read).length, [notifications])
	const importantNotifications = useMemo(
		() => notifications.filter((item) => IMPORTANT_NOTIFICATION_TYPES.has(item.type)),
		[notifications],
	)
	const activeNotifications = notificationsTab === 'all' ? notifications : importantNotifications
	const isListLoading = isLoadingNotifications || !isNotificationsEnabled

	const handleSelect = (id: number, isRead?: boolean) => {
		router.push(`${pathname}?id=${id}`)
		if (!isRead) markRead(id)
	}

	return (
		<div className='flex h-full flex-col gap-4 xs:px-2 xs:py-4 md:px-6 lg:px-8'>
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
					<Button
						variant='ghost'
						size='sm'
						className='has-[>svg]:px-0'
						disabled={isListLoading}
						onClick={() => refetchNotifications()}
					>
						<RefreshCcw className='size-4' />
						{t('notifications.actions.refresh')}
					</Button>
					<Button
						variant='ghost'
						size='sm'
						className='has-[>svg]:px-0'
						disabled={isMarkingAllRead || notifications.length === 0 || isListLoading}
						onClick={() => markAllRead()}
					>
						<CheckCheck className='size-4' />
						{t('notifications.actions.markAllRead')}
					</Button>
				</div>
			</div>

			<Card className='grid h-full grid-cols-1 gap-4 rounded-4xl p-4 lg:grid-cols-[340px_1fr]'>
				<div className='overflow-hidden rounded-2xl border bg-white shadow-sm'>
					<div className='flex items-center justify-between border-b px-4 py-3'>
						<p className='text-sm font-semibold'>{t('notifications.list.title')}</p>
						<p className='text-xs text-muted-foreground'>
							{isListLoading
								? t('notifications.list.loading')
								: t('notifications.list.total', { count: notifications.length })}
						</p>
					</div>
					<div className='border-b px-4 py-2'>
						<Tabs value={notificationsTab} onValueChange={(value) => setNotificationsTab(value as 'all' | 'important')}>
							<TabsList className='w-full'>
								<TabsTrigger value='all' className='flex-1'>
									{t('notifications.tabs.all', { count: notifications.length })}
								</TabsTrigger>
								<TabsTrigger value='important' className='flex-1'>
									{t('notifications.tabs.important', { count: importantNotifications.length })}
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
									onClick={() => handleSelect(item.id, item.is_read)}
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

				<div className='min-h-[320px] rounded-2xl border bg-white p-5 shadow-sm'>
					{selectedNotification ? (
						<NotificationDetails notification={selectedNotification} />
					) : (
						<div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
							{isListLoading ? <Loader /> : t('notifications.details.empty')}
						</div>
					)}
				</div>
			</Card>
		</div>
	)
}
