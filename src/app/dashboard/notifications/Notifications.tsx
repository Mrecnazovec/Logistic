'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { ScrollArea, ScrollBar } from '@/components/ui/ScrollArea'
import { useNotifications } from '@/hooks/queries/notifications/useNotifications'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
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
		if (!currentParam) {
			router.replace(`${pathname}?id=${selectedId}`)
		}
	}, [pathname, router, searchParams, selectedId])

	useEffect(() => {
		if (selectedId === null || !isNotificationsEnabled) return
		const match = notifications.find((item) => item.id === selectedId)
		if (match) {
			if (!match.is_read) {
				markRead(match.id)
			}
			return
		}
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		} else if (!hasNextPage && !isLoadingNotifications && !isFetchingNextPage) {
			refetchNotifications()
		}
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

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting) && hasNextPage && !isFetchingNextPage) {
					fetchNextPage()
				}
			},
			{ root, rootMargin: '0px', threshold: 1 },
		)

		observer.observe(sentinel)
		return () => observer.disconnect()
	}, [fetchNextPage, hasNextPage, isFetchingNextPage])

	const selectedNotification = useMemo(
		() => notifications.find((item) => item.id === selectedId),
		[notifications, selectedId],
	)

	const unreadCount = useMemo(
		() => notifications.filter((item) => !item.is_read).length,
		[notifications],
	)

	const handleSelect = (id: number, isRead?: boolean) => {
		router.push(`${pathname}?id=${id}`)
		if (!isRead) {
			markRead(id)
		}
	}

	return (
		<div className='flex flex-col h-full gap-4 xs:px-2 md:px-6 lg:px-8 xs:py-4'>
			<div className='flex items-center justify-between gap-3 flex-wrap'>
				<div className='flex items-center gap-2 flex-wrap'>
					<Bell className='size-5 text-brand' />
					<h1 className='text-2xl font-semibold'>Уведомления</h1>
					{unreadCount > 0 && (
						<span className='text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium'>
							Непрочитанных: {unreadCount}
						</span>
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
						Все прочитано
					</Button>
				</div>
			</div>

			<Card className='grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 p-4 h-full rounded-4xl'>
				<div className='border rounded-2xl overflow-hidden shadow-sm bg-white'>
					<div className='flex items-center justify-between px-4 py-3 border-b'>
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
										'w-full text-left px-4 py-3 border-b last:border-b-0 flex flex-col gap-1 transition-colors',
										item.id === selectedId
											? 'bg-brand/10 border-l-4 border-l-brand'
											: 'hover:bg-accent/50',
										!item.is_read && 'font-bold',
									)}
								>
									<p className='text-sm text-gray-900 line-clamp-2 flex items-start gap-2'>
										<Tag className='size-4 text-brand mt-0.5' /> {item.title}
									</p>
									<p className='text-xs text-muted-foreground'>
										{format(new Date(item.created_at), 'dd.MM.yyyy HH:mm')}
									</p>
								</button>
							))}
							<div ref={sentinelRef} className='h-1' />
							{isFetchingNextPage && (
								<div className='py-3 text-center text-xs text-muted-foreground'>Загрузка...</div>
							)}
							{notifications.length === 0 && !isLoadingNotifications && (
								<div className='py-6 text-center text-sm text-muted-foreground'>Нет уведомлений</div>
							)}
						</div>
						<ScrollBar />
					</ScrollArea>
				</div>

				<div className='border rounded-2xl p-5 bg-white shadow-sm min-h-[320px]'>
					{selectedNotification ? (
						<div className='flex flex-col gap-3'>
							<div className='flex flex-wrap items-center justify_between gap-2 border-b pb-3'>
								<div className='flex items-center gap-2'>
									<Tag className='size-4 text-brand' />
									<h2 className='text-lg font-semibold'>{selectedNotification.title}</h2>
								</div>
								<p className='text-xs text-muted-foreground'>
									{format(new Date(selectedNotification.created_at), 'dd.MM.yyyy HH:mm')}
								</p>
							</div>
							{selectedNotification.message && (
								<p className='text-sm text-gray-800 leading-relaxed'>{selectedNotification.message}</p>
							)}
							<div className='text-xs text-muted-foreground'>
								Тип: <span className='font-semibold text-gray-900'>{selectedNotification.type}</span>
							</div>
							{selectedNotification.payload && (
								<div className='rounded-xl border bg-gray-50 p-3 text-xs text-gray-700'>
									<p className='font-semibold text-sm mb-2'>Детали</p>
									<pre className='whitespace-pre-wrap break-all text-xs'>
										{JSON.stringify(selectedNotification.payload, null, 2)}
									</pre>
								</div>
							)}
						</div>
					) : (
						<div className='h-full flex items-center justify-center text-sm text-muted-foreground'>
							{isLoadingNotifications ? <Loader /> : 'Выберите уведомление'}
						</div>
					)}
				</div>
			</Card>
		</div>
	)
}
