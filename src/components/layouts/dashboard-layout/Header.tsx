'use client'

import { Button } from '@/components/ui/Button'
import { NoPhoto } from '@/components/ui/NoPhoto'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { DASHBOARD_URL } from '@/config/url.config'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useNotifications } from '@/hooks/queries/notifications/useNotifications'
import { cn } from '@/lib/utils'
import { RoleEnum, RoleSelect } from '@/shared/enums/Role.enum'
import { useRoleStore } from '@/store/useRoleStore'
import { format } from 'date-fns'
import { Bell, CheckCheck, ChevronLeft, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { resolveHeaderNavItems } from './HeaderNavConfig'

export function Header() {
	const pathname = usePathname()
	const role = useRoleStore((state) => state.role)
	const { items: navItems, backLink } = useMemo(
		() => resolveHeaderNavItems(pathname, role),
		[pathname, role],
	)
	const { me, isLoading } = useGetMe()
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
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
	} = useNotifications(true)
	const scrollRef = useRef<HTMLDivElement | null>(null)
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const lastUnreadRef = useRef(0)

	useEffect(() => {
		audioRef.current = new Audio('/sounds/notification.mp3')
	}, [])

	useEffect(() => {
		if (isNotificationsOpen) {
			refetchNotifications()
		}
	}, [isNotificationsOpen, refetchNotifications])

	useEffect(() => {
		const interval = setInterval(() => {
			refetchNotifications()
		}, 300000)
		return () => clearInterval(interval)
	}, [refetchNotifications])

	const unreadCount = useMemo(
		() => notifications.filter((item) => !item.is_read).length,
		[notifications],
	)

	useEffect(() => {
		const currentUnread = unreadCount
		if (audioRef.current && currentUnread > lastUnreadRef.current) {
			audioRef.current.play().catch(() => undefined)
		}
		lastUnreadRef.current = currentUnread
	}, [unreadCount])

	const handleMarkRead = (id: number, isRead?: boolean) => {
		if (!isRead) {
			markRead(id)
		}
	}

	const handleScroll = useCallback(() => {
		const node = scrollRef.current
		if (!node || isFetchingNextPage || !hasNextPage) return
		const threshold = 40
		if (node.scrollTop + node.clientHeight >= node.scrollHeight - threshold) {
			fetchNextPage()
		}
	}, [fetchNextPage, hasNextPage, isFetchingNextPage])

	return (
		<header className='h-auto min-h-24 flex items-center xs:justify-between md:pl-10 md:pr-15 bg-white border-b shadow-lg px-4 max-xs:pt-4 max-xs:flex-col-reverse gap-4 sticky top-0 z-30'>
			<div className='flex flex-col items-center gap-3 xs:self-end self-start'>
				{backLink && (
					<Link
						className='flex justify-center self-start items-center gap-2.5 text-brand text-xl font-medium hover:text-brand/70 transition-colors'
						href={backLink.href}
					>
						<ChevronLeft /> {backLink.label}
					</Link>
				)}
				{navItems.length > 0 && (
					<nav className='flex self-start gap-6 font-medium text-gray-700'>
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									'pb-2 border-b-4 max-md:text-xs text-center transition-colors',
									item.active
										? 'border-b-brand text-brand font-semibold'
										: 'border-b-transparent hover:text-brand/70',
								)}
							>
								{item.label}
							</Link>
						))}
					</nav>
				)}
			</div>

			<div className='flex items-center gap-3 max-xs:self-end'>
				{isLoading ? (
					<Loader2 className='size-5 animate-spin' />
				) : (
					<>
						<Link href={DASHBOARD_URL.notifications()} className='sm:hidden'>
							<Button
								size='icon'
								className={cn(
									'rounded-[13.5px] bg-brand/20 hover:bg-brand/10 size-9 relative',
									unreadCount > 0 && 'ring-2 ring-brand/30',
								)}
							>
								<Bell className='size-5 text-brand' />
								{unreadCount > 0 && (
									<span className='absolute -top-1 -right-1 min-w-5 min-h-5 rounded-full bg-error-500 text-white text-[10px] leading-5 font-semibold px-1 text-center'>
										{unreadCount > 9 ? '9+' : unreadCount}
									</span>
								)}
							</Button>
						</Link>

						<div className='hidden sm:block'>
							<Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
								<PopoverTrigger asChild>
									<Button
										size='icon'
										className={cn(
											'rounded-[13.5px] bg-brand/20 hover:bg-brand/10 size-9 relative',
											unreadCount > 0 && 'ring-2 ring-brand/30',
										)}
									>
										<Bell className='size-5 text-brand' />
										{unreadCount > 0 && (
											<span className='absolute -top-1 -right-1 min-w-5 min-h-5 rounded-full bg-error-500 text-white text-[10px] leading-5 font-semibold px-1 text-center'>
												{unreadCount > 9 ? '9+' : unreadCount}
											</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent align='end' className='w-[360px] p-0 shadow-xl'>
									<div className='flex items-center justify-between px-4 py-3 border-b'>
										<div>
											<p className='text-base font-semibold'>Уведомления</p>
											<p className='text-xs text-gray-500'>
												{isLoadingNotifications ? 'Загрузка...' : `Последние: ${notifications.length}`}
											</p>
										</div>
										<Button
											variant='ghost'
											size='sm'
											disabled={
												isLoadingNotifications || isMarkingAllRead || notifications.length === 0
											}
											onClick={() => markAllRead()}
											className='h-8 px-2 text-xs text-brand hover:text-brand/80'
										>
											<CheckCheck className='size-4' />
											Все прочитано
										</Button>
									</div>
									{notifications.length === 0 && !isLoadingNotifications ? (
										<div className='py-6 text-center text-sm text-muted-foreground'>Нет уведомлений</div>
									) : (
										<div
											ref={scrollRef}
											onScroll={handleScroll}
											className='max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-border'
										>
											<div className='flex flex-col'>
												{notifications.map((item) => (
													<Link
														key={item.id}
														href={`${DASHBOARD_URL.home()}notifications?id=${item.id}`}
														onMouseEnter={() => handleMarkRead(item.id, item.is_read)}
														className={cn(
															'text-left px-4 py-3 flex flex-col gap-1 transition-colors border-b last:border-none',
															item.is_read
																? 'bg-white hover:bg-accent/40'
																: 'bg-brand/5 border-l-4 border-l-brand hover:bg-brand/10',
														)}
													>
														<p className='text-sm font-semibold text-gray-900 line-clamp-2'>
															{item.title}
														</p>
														{item.message && (
															<p className='text-sm text-gray-600 line-clamp-2'>{item.message}</p>
														)}
														<p className='text-[11px] text-gray-500'>
															{format(new Date(item.created_at), 'dd.MM.yyyy HH:mm')}
														</p>
													</Link>
												))}
											</div>
											{isFetchingNextPage && (
												<div className='py-2 text-center text-xs text-muted-foreground'>Загрузка...</div>
											)}
										</div>
									)}
								</PopoverContent>
							</Popover>
						</div>

						<Link
							href={DASHBOARD_URL.cabinet()}
							className='flex items-center gap-3'
						>
							{me?.photo ? (
								<Image
									src={me.photo}
									width={28}
									height={28}
									className='size-7 rounded-full object-cover'
									alt={me.username}
								/>
							) : (
								<NoPhoto />
							)}
							<div>
								<p className='font-medium text-base max-md:hidden'>
									{me?.first_name || 'Без имени'}
								</p>
								<div className='flex items-center justify-between gap-2'>
									<p className='text-xs max-md:hidden'>
										{RoleSelect.find((type) => type.type === me?.role)?.name ?? 'Неизвестно'}
									</p>
									{role !== RoleEnum.LOGISTIC && (
										<p className='text-xs max-md:hidden'>
											{role === RoleEnum.CARRIER ? me?.rating_as_carrier : me?.rating_as_customer} ★
										</p>
									)}
								</div>
							</div>
						</Link>
					</>
				)}
			</div>
		</header>
	)
}
