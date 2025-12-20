'use client'

import { Button } from '@/components/ui/Button'
import { DASHBOARD_URL } from '@/config/url.config'
import { useNotifications } from '@/hooks/queries/notifications/useNotifications'
import { cn } from '@/lib/utils'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { useRoleStore } from '@/store/useRoleStore'
import { Bell, ChevronRight, MoreHorizontal, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { getNavItems, type NavItem } from './NavItems'

export function MobileNav() {
	const pathname = usePathname()
	const filteredPathname = `${pathname}/`
	const role = useRoleStore((state) => state.role)
	const [isMoreOpen, setIsMoreOpen] = useState(false)
	const { notifications } = useNotifications(true)
	const navItems = useMemo(() => getNavItems(role), [role])
	const deskHref = role === RoleEnum.CARRIER ? DASHBOARD_URL.desk('my') : DASHBOARD_URL.desk()

	const unreadCount = useMemo(
		() => notifications.filter((item) => !item.is_read).length,
		[notifications],
	)

	const normalizeHref = (href: string) => (href.endsWith('/') ? href : `${href}/`)

	const labelOverrides: Record<string, string> = useMemo(
		() => ({
			[DASHBOARD_URL.announcements()]: 'Доска объявлений',
			[deskHref]: 'Торговля',
			[DASHBOARD_URL.transportation()]: 'Мои грузы',
			[DASHBOARD_URL.notifications()]: 'Уведомления',
		}),
		[deskHref],
	)

	const isAllowed = useMemo(
		() => (roles?: NavItem['roles']) => {
			if (!roles) return true
			if (Array.isArray(roles)) return role ? roles.includes(role) : false
			return roles(role)
		},
		[role],
	)

	const visibleNavGroups = useMemo(
		() =>
			navItems
				.filter((group) => isAllowed(group.roles))
				.map((group) => ({
					...group,
					items: group.items.filter((item) => isAllowed(item.roles)),
				}))
				.filter((group) => group.items.length > 0),
		[isAllowed, navItems],
	)

	const allItems = useMemo(
		() => visibleNavGroups.flatMap((group) => group.items),
		[visibleNavGroups],
	)

	const prioritizedHrefs = [
		DASHBOARD_URL.announcements(),
		deskHref,
		DASHBOARD_URL.transportation(),
	]

	const prioritizedItems = prioritizedHrefs
		.map((href) => allItems.find((item) => normalizeHref(item.href).startsWith(normalizeHref(href))))
		.filter(Boolean)
		.filter((item, idx, arr) => arr.findIndex((i) => i!.href === item!.href) === idx) as typeof allItems

	const fallbackItems = allItems.filter(
		(item) => !prioritizedItems.some((prioritized) => prioritized.href === item.href),
	)

	const mainNavItems = [...prioritizedItems, ...fallbackItems].slice(0, 3)
	const usedHrefs = new Set(mainNavItems.map((item) => item.href))
	const additionalItems = allItems.filter((item) => !usedHrefs.has(item.href))
	const isMoreActive = additionalItems.some((item) => filteredPathname.startsWith(normalizeHref(item.href)))
	const isNotificationsActive = filteredPathname.startsWith(normalizeHref(DASHBOARD_URL.notifications()))

	const renderNavButton = (item: (typeof mainNavItems)[number]) => {
		const Icon = item.icon
		const isActive = filteredPathname.startsWith(normalizeHref(item.href))

		return (
			<Link
				key={item.href}
				href={item.href}
				aria-current={isActive ? 'page' : undefined}
				className={cn(
					'flex flex-col items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors',
					isActive && 'text-brand',
				)}
			>
				<span
					className={cn(
						'relative flex size-11 items-center justify-center rounded-2xl bg-muted/50 text-foreground/70 shadow-sm',
						'border border-transparent',
						isActive && 'bg-brand/10 text-brand border-brand/30 ring-1 ring-brand/30',
					)}
				>
					<Icon className='size-5' />
				</span>
				{/* <span className='max-w-[80px] text-center leading-tight line-clamp-1'>
					{labelOverrides[item.href] ?? item.label}
				</span> */}
				<span
					aria-hidden='true'
					className={cn(
						'h-0.5 w-8 rounded-full bg-transparent transition-colors',
						isActive && 'bg-brand',
					)}
				/>
			</Link>
		)
	}

	return (
		<nav
			aria-label='Navigation'
			className='md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80'
		>
			<div className='grid grid-cols-5 items-end gap-1 px-2 py-2'>
				{mainNavItems.map((item) => renderNavButton(item))}

				<Link
					href={DASHBOARD_URL.notifications()}
					className={cn(
						'flex flex-col items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors',
						isNotificationsActive && 'text-brand',
					)}
					aria-current={isNotificationsActive ? 'page' : undefined}
				>
					<span
						className={cn(
							'relative flex size-11 items-center justify-center rounded-2xl bg-muted/50 text-foreground/70 shadow-sm border border-transparent',
							isNotificationsActive && 'bg-brand/10 text-brand border-brand/30 ring-1 ring-brand/30',
						)}
					>
						<Bell className='size-5' />
						{unreadCount > 0 && (
							<span className='absolute -top-1 -right-1 min-w-5 min-h-5 rounded-full bg-error-500 px-1 text-center text-[10px] font-semibold leading-5 text-white'>
								{unreadCount > 9 ? '9+' : unreadCount}
							</span>
						)}
					</span>
					{/* <span className='text-center leading-tight'>
						{labelOverrides[DASHBOARD_URL.notifications()]}
					</span> */}
					<span
						aria-hidden='true'
						className={cn(
							'h-0.5 w-8 rounded-full bg-transparent transition-colors',
							isNotificationsActive && 'bg-brand',
						)}
					/>
				</Link>

				<button
					type='button'
					onClick={() => setIsMoreOpen(true)}
					className={cn(
						'flex flex-col items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors',
						isMoreActive && 'text-brand',
					)}
					aria-pressed={isMoreOpen}
				>
					<span
						className={cn(
							'relative flex size-11 items-center justify-center rounded-2xl bg-muted/50 text-foreground/70 shadow-sm border border-transparent',
							isMoreActive && 'bg-brand/10 text-brand border-brand/30 ring-1 ring-brand/30',
						)}
					>
						<MoreHorizontal className='size-5' />
					</span>
					{/* <span className='text-center leading-tight'>Ещё</span> */}
					<span
						aria-hidden='true'
						className={cn(
							'h-0.5 w-8 rounded-full bg-transparent transition-colors',
							(isMoreActive || isMoreOpen) && 'bg-brand',
						)}
					/>
				</button>
			</div>

			{isMoreOpen && (
				<div
					className='fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]'
					onClick={() => setIsMoreOpen(false)}
				>
					<div
						className='absolute inset-x-0 bottom-0 flex flex-col rounded-t-3xl bg-background shadow-2xl ring-1 ring-border'
						onClick={(event) => event.stopPropagation()}
					>
						<div className='flex items-center justify-between px-5 py-4 border-b border-border'>
							<p className='text-lg font-semibold'>Дополнительно</p>
							<Button
								size='icon'
								variant='ghost'
								onClick={() => setIsMoreOpen(false)}
								className='rounded-full'
								aria-label='Закрыть меню'
							>
								<X className='size-5' />
							</Button>
						</div>

						<div className='max-h-[60vh] overflow-y-auto py-2'>
							{additionalItems.length === 0 ? (
								<p className='px-5 py-3 text-sm text-muted-foreground'>Другие разделы недоступны.</p>
							) : (
								additionalItems.map((item) => {
									const Icon = item.icon
									const isActive = filteredPathname.startsWith(normalizeHref(item.href))

									return (
										<Link
											key={item.href}
											href={item.href}
											onClick={() => setIsMoreOpen(false)}
											className={cn(
												'flex items-center justify-between gap-3 px-5 py-3 transition-colors',
												isActive
													? 'bg-brand/5 text-brand'
													: 'text-foreground hover:bg-muted/40',
											)}
										>
											<span className='flex items-center gap-3 text-base font-medium'>
												<span className='flex size-10 items-center justify-center rounded-2xl bg-muted/60 text-foreground/70'>
													<Icon className='size-5' />
												</span>
												{item.label}
											</span>
											<ChevronRight className='size-4 text-muted-foreground' />
										</Link>
									)
								})
							)}
						</div>
					</div>
				</div>
			)}
		</nav>
	)
}




