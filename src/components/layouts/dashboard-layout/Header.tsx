'use client'

import { Button } from '@/components/ui/Button'
import { NoPhoto } from '@/components/ui/NoPhoto'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { PolicyAgreementModal } from '@/components/ui/modals/PolicyAgreementModal'
import { notificationTypeSamples } from '@/app/dashboard/notifications/notificationTypes'
import { DASHBOARD_URL, withLocale } from '@/config/url.config'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { usePatchMe } from '@/hooks/queries/me/usePatchMe'
import { useNotifications } from '@/hooks/queries/notifications/useNotifications'
import { useNotificationsRealtime } from '@/hooks/queries/notifications/useNotificationsRealtime'
import { useI18n } from '@/i18n/I18nProvider'
import { stripLocaleFromPath } from '@/i18n/paths'
import { cn } from '@/lib/utils'
import { RoleEnum, RoleSelect } from '@/shared/enums/Role.enum'
import type { INotification } from '@/shared/types/Notification.interface'
import { useOfferRealtimeStore } from '@/store/useOfferRealtimeStore'
import { useRoleStore } from '@/store/useRoleStore'
import { useSearchDrawerStore } from '@/store/useSearchDrawerStore'
import { format } from 'date-fns'
import { Bell, CheckCheck, ChevronLeft, Loader2, Search, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { resolveHeaderNavItems } from './HeaderNavConfig'

const SEARCH_ENABLED_ROUTES = [
	'/dashboard/transportation',
	'/dashboard/transportation/my',
	'/dashboard/announcements',
	'/dashboard/history',
	'/dashboard/desk',
	'/dashboard/desk/my',
	'/dashboard/rating',
]

const IMPORTANT_NOTIFICATION_TYPES = new Set<string>(
	notificationTypeSamples.filter((item) => item.importance).map((item) => item.type)
)

export function Header() {
	const pathname = usePathname()
	const router = useRouter()
	const { locale, t } = useI18n()
	const normalizedPathname = stripLocaleFromPath(pathname)
	const role = useRoleStore((state) => state.role)
	const { items: navItems, backLink } = resolveHeaderNavItems(pathname, role)
	const { me, isLoading } = useGetMe()
	const { patchMe, isLoadingPatchMe } = usePatchMe()
	const [policyOpen, setPolicyOpen] = useState(false)
	const [policyAccepted, setPolicyAccepted] = useState(false)
	const shouldForceOpen = me?.is_accept_policy === false
	const isPolicyOpen = shouldForceOpen ? true : policyOpen
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
	const [notificationsTab, setNotificationsTab] = useState<'all' | 'important'>('all')
	const {
		firstPageNotifications,
		refetchNotifications,
		isLoadingNotifications,
		markAllRead,
		isMarkingAllRead,
		isNotificationsEnabled,
	} = useNotifications(true)
	useNotificationsRealtime(isNotificationsEnabled, {
		onEvent: () => {
			refetchNotifications()
			if (!audioRef.current) return
			audioRef.current.currentTime = 0
			audioRef.current.play().catch(() => undefined)
		},
	})
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const lastUnreadRef = useRef(0)
	const openSearchDrawer = useSearchDrawerStore((state) => state.open)
	const unreadOffers = useOfferRealtimeStore((state) => state.unreadOffers)

	const isSearchAvailable = SEARCH_ENABLED_ROUTES.some((route) => normalizedPathname?.startsWith(route))

	useEffect(() => {
		audioRef.current = new Audio('/sounds/notification.mp3')
	}, [])

	useEffect(() => {
		if (isNotificationsOpen && isNotificationsEnabled) {
			refetchNotifications()
		}
	}, [isNotificationsEnabled, isNotificationsOpen, refetchNotifications])

	const allNotifications = firstPageNotifications
	const importantNotifications = allNotifications.filter((item) => IMPORTANT_NOTIFICATION_TYPES.has(item.type))
	const activeNotifications = notificationsTab === 'all' ? allNotifications : importantNotifications
	const unreadCount = allNotifications.filter((item) => !item.is_read).length

	useEffect(() => {
		lastUnreadRef.current = unreadCount
	}, [unreadCount])

	const visibleNavItems = navItems.filter((item) => item.labelKey)
	const { hasDeskUnread, hasMyOffersUnread } = useMemo(() => {
		let desk = false
		let myOffers = false
		for (const item of unreadOffers) {
			if (item.target === 'desk') desk = true
			if (item.target === 'myOffers') myOffers = true
			if (desk && myOffers) break
		}
		return { hasDeskUnread: desk, hasMyOffersUnread: myOffers }
	}, [unreadOffers])

	const handlePolicySubmit = () => {
		if (!policyAccepted || isLoadingPatchMe) return
		patchMe({ is_accept_policy: true })
		setPolicyOpen(false)
		setPolicyAccepted(false)
	}

	const handlePolicyOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && shouldForceOpen) {
			return
		}
		setPolicyOpen(nextOpen)
	}

	const renderNotifications = (list: INotification[]) => {
		if (list.length === 0 && !isLoadingNotifications) {
			return (
				<div className='py-6 text-center text-sm text-muted-foreground'>
					{t('components.dashboard.header.notifications.empty')}
				</div>
			)
		}

		return (
			<div className='max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-border'>
				<div className='flex flex-col'>
					{list.map((item) => (
						<Link
							key={item.id}
							href={`${withLocale(DASHBOARD_URL.notifications(), locale)}?id=${item.id}`}
							className={cn(
								'text-left px-4 py-3 flex flex-col gap-1 transition-colors border-b last:border-none',
								item.is_read
									? 'bg-white hover:bg-accent/40'
									: 'bg-brand/5 border-l-4 border-l-brand hover:bg-brand/10',
							)}
						>
							<p className='text-sm font-semibold text-gray-900 line-clamp-2'>{item.title}</p>
							{item.message && <p className='text-sm text-gray-600 line-clamp-2'>{item.message}</p>}
							<p className='text-[11px] text-gray-500'>
								{format(new Date(item.created_at), 'dd.MM.yyyy HH:mm')}
							</p>
						</Link>
					))}
				</div>
			</div>
		)
	}

	const handleBackClick = () => {
		if (typeof window !== 'undefined' && window.history.length > 1) {
			router.back()
			return
		}
		if (backLink) {
			router.push(backLink.href)
		}
	}

	return (
		<>
			<header className='h-auto md:min-h-24 flex items-center justify-between md:pl-10 md:pr-15 bg-white border-b shadow-lg md:px-4 px-3 max-md:pt-3 gap-4 sticky top-0 z-30'>
				<div className='flex flex-col items-center gap-3 self-end flex-1 min-w-0'>
					{backLink && (
						<button
							type='button'
							className='flex justify-center self-start items-center gap-2.5 text-brand md:text-xl text-md font-medium hover:text-brand/70 transition-colors line-clamp-1 cursor-pointer'
							onClick={handleBackClick}
						>
							<ChevronLeft /> {t(backLink.labelKey)}
						</button>
					)}
					{visibleNavItems.length > 0 && (
						<nav className='flex self-start gap-4 sm:gap-6 font-medium text-gray-700 overflow-x-auto max-w-full whitespace-nowrap px-2 pt-2'>
							{visibleNavItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										'pb-2 border-b-4 max-md:text-xs text-center transition-colors shrink-0',
										item.active
											? 'border-b-brand text-brand font-semibold'
											: 'border-b-transparent hover:text-brand/70',
									)}
								>
									<span className='relative'>
										{t(item.labelKey)}
										{item.labelKey === 'components.dashboard.headerNav.desk' && hasDeskUnread ? (
											<span className='absolute -top-1 -right-2 size-2 rounded-full bg-error-500' />
										) : null}
										{item.labelKey === 'components.dashboard.headerNav.desk.myOffers' && hasMyOffersUnread ? (
											<span className='absolute -top-1 -right-2 size-2 rounded-full bg-error-500' />
										) : null}
									</span>
								</Link>
							))}
						</nav>
					)}
				</div>

				<div className='flex items-center gap-3 max-md:self-start shrink-0'>
					{isLoading ? (
						<Loader2 className='md:size-9 size-7 animate-spin max-md:mb-3 max-md:mr-3' />
					) : (
						<>
							{isSearchAvailable ? (
								<Button
									type='button'
									variant='outline'
									size='icon'
									onClick={() => openSearchDrawer()}
									className='md:hidden rounded-full border-grayscale-200 mb-3 xs:size-9 size-7'
								>
									<Search className='w-3/4 h-3/4' />
								</Button>
							) : null}
							<div className='hidden md:block'>
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
										<Tabs value={notificationsTab} onValueChange={(value) => setNotificationsTab(value as 'all' | 'important')}>
											<div className='flex items-center justify-between px-4 py-3 border-b'>
												<div>
													<p className='text-base font-semibold'>{t('components.dashboard.header.notifications.title')}</p>
													<p className='text-xs text-gray-500'>
														{isLoadingNotifications
															? t('components.dashboard.header.notifications.loading')
															: t('components.dashboard.header.notifications.latest', {
																count: allNotifications.length,
															})}
													</p>
												</div>
												<Button
													variant='ghost'
													size='sm'
													disabled={
														isLoadingNotifications || isMarkingAllRead || allNotifications.length === 0
													}
													onClick={() => markAllRead()}
													className='h-8 px-2 text-xs text-brand hover:text-brand/80'
												>
													<CheckCheck className='size-4' />
													{t('components.dashboard.header.notifications.allRead')}
												</Button>
											</div>
											<div className='px-4 py-2 border-b'>
												<TabsList className='w-full'>
													<TabsTrigger value='all' className='flex-1'>
														{t('components.dashboard.header.notifications.tabs.all', {
															count: allNotifications.length,
														})}
													</TabsTrigger>
													<TabsTrigger value='important' className='flex-1'>
														{t('components.dashboard.header.notifications.tabs.important', {
															count: importantNotifications.length,
														})}
													</TabsTrigger>
												</TabsList>
											</div>
											{renderNotifications(activeNotifications)}
										</Tabs>
									</PopoverContent>
								</Popover>
							</div>

							<Link
								href={withLocale(DASHBOARD_URL.cabinet(), locale)}
								className='flex items-center gap-3 max-md:mb-3'
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
										{me?.first_name || t('components.dashboard.header.profile.noName')}
									</p>
									<div className='flex items-center justify-between gap-2'>
										<p className='text-xs max-md:hidden'>
											{RoleSelect.find((type) => type.type === me?.role)?.nameKey
												? t(RoleSelect.find((type) => type.type === me?.role)?.nameKey ?? '')
												: t('components.dashboard.header.profile.unknownRole')}
										</p>
										{role !== RoleEnum.LOGISTIC && (
											<p className='text-xs max-md:hidden flex items-center'>
												{role === RoleEnum.CARRIER ? me?.rating_as_carrier : me?.rating_as_customer}{' '}
												<Star className='size-4 fill-warning-500 text-warning-500' />
											</p>
										)}
									</div>
								</div>
							</Link>
						</>
					)}
				</div>
			</header>
			<PolicyAgreementModal
				open={isPolicyOpen}
				onOpenChange={handlePolicyOpenChange}
				accepted={policyAccepted}
				onAcceptedChange={setPolicyAccepted}
				onSubmit={handlePolicySubmit}
				isSubmitting={isLoadingPatchMe}
			/>
		</>
	)
}
