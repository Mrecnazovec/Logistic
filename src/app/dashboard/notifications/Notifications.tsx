"use client"

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { ScrollArea, ScrollBar } from '@/components/ui/ScrollArea'
import { useNotifications } from '@/hooks/queries/notifications/useNotifications'
import { cn } from '@/lib/utils'
import { formatDateTimeValue } from '@/lib/formatters'
import { Bell, CheckCheck, RefreshCcw, Tag } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'

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

	const searchParams = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()
	const listRef = useRef<HTMLDivElement | null>(null)
	const sentinelRef = useRef<HTMLDivElement | null>(null)

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
	}, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoadingNotifications, isNotificationsEnabled, markRead, notifications, refetchNotifications, selectedId])

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

	const handleSelect = (id: number, isRead?: boolean) => {
		router.push(`${pathname}?id=${id}`)
		if (!isRead) markRead(id)
	}

	return (
		<div className='flex h-full flex-col gap-4 xs:px-2 xs:py-4 md:px-6 lg:px-8'>
			<div className='flex flex-wrap items-center justify-between gap-3'>
				<div className='flex flex-wrap items-center gap-2'>
					<Bell className='size-5 text-brand' />
					<h1 className='text-2xl font-semibold'>Уведомления</h1>
					{unreadCount > 0 && (
						<span className='rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700'>Непрочитано: {unreadCount}</span>
					)}
				</div>
				<div className='flex items-center gap-2'>
					<Button
						variant='ghost'
						size='sm'
						className='has-[>svg]:px-0'
						disabled={isLoadingNotifications || !isNotificationsEnabled}
						onClick={() => refetchNotifications()}
					>
						<RefreshCcw className='size-4' />
						Обновить
					</Button>
					<Button
						variant='ghost'
						size='sm'
						className='has-[>svg]:px-0'
						disabled={isMarkingAllRead || notifications.length === 0 || !isNotificationsEnabled}
						onClick={() => markAllRead()}
					>
						<CheckCheck className='size-4' />
						Отметить всё прочитанным
					</Button>
				</div>
			</div>

			<Card className='grid h-full grid-cols-1 gap-4 rounded-4xl p-4 lg:grid-cols-[340px_1fr]'>
				<div className='overflow-hidden rounded-2xl border bg-white shadow-sm'>
					<div className='flex items-center justify-between border-b px-4 py-3'>
						<p className='text-sm font-semibold'>Список</p>
						<p className='text-xs text-muted-foreground'>
							{isLoadingNotifications ? 'Загрузка...' : `Всего: ${notifications.length}`}
						</p>
					</div>
					<ScrollArea className='h-[580px]'>
						<div ref={listRef} className='max-h-full overflow-y-auto'>
							{notifications.map((item) => (
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
							{isFetchingNextPage && <div className='py-3 text-center text-xs text-muted-foreground'>Загрузка...</div>}
							{notifications.length === 0 && !isLoadingNotifications && (
								<div className='py-6 text-center text-sm text-muted-foreground'>Уведомлений нет</div>
							)}
						</div>
						<ScrollBar />
					</ScrollArea>
				</div>

				<div className='min-h-[320px] rounded-2xl border bg-white p-5 shadow-sm'>
					{selectedNotification ? (
						<div className='flex flex-col gap-3'>
							<div className='flex flex-wrap items-center justify-between gap-2 border-b pb-3'>
								<div className='flex items-center gap-2'>
									<Tag className='size-4 text-brand' />
									<h2 className='text-lg font-semibold'>{selectedNotification.title}</h2>
								</div>
								<p className='text-xs text-muted-foreground'>{formatDateTimeValue(selectedNotification.created_at)}</p>
							</div>
							{selectedNotification.message && <p className='text-sm leading-relaxed text-gray-800'>{selectedNotification.message}</p>}
							<div className='text-xs text-muted-foreground'>Тип: <span className='font-semibold text-gray-900'>{selectedNotification.type}</span></div>
							{selectedNotification.payload && (
								<div className='rounded-xl border bg-gray-50 p-3 text-xs text-gray-700'>
									<p className='mb-2 text-sm font-semibold'>Детали</p>
									<pre className='whitespace-pre-wrap break-all text-xs'>{JSON.stringify(selectedNotification.payload, null, 2)}</pre>
								</div>
							)}
						</div>
					) : (
						<div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
							{isLoadingNotifications ? <Loader /> : 'Выберите уведомление'}
						</div>
					)}
				</div>
			</Card>
		</div>
	)
}
