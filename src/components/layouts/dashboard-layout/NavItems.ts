import type { LucideIcon } from 'lucide-react'
import { CircleStar, Clock, HomeIcon, Layers3, Package, Search, Settings } from 'lucide-react'

import { DASHBOARD_URL, withLocale } from '@/config/url.config'
import type { Locale } from '@/i18n/config'
import { RoleEnum } from '@/shared/enums/Role.enum'

type RoleGuard = RoleEnum[] | ((role?: RoleEnum) => boolean)

export interface NavItem {
	href: string
	icon: LucideIcon
	labelKey: string
	roles?: RoleGuard
}

export interface NavGroup {
	group?: string
	items: NavItem[]
	roles?: RoleGuard
}

export const getNavItems = (role?: RoleEnum, locale?: Locale): NavGroup[] => {
	const deskHref = withLocale(role === RoleEnum.CARRIER ? DASHBOARD_URL.desk('my') : DASHBOARD_URL.desk(), locale)
	const transportationHref = withLocale(role === RoleEnum.CARRIER ? DASHBOARD_URL.transportation('my') : DASHBOARD_URL.transportation(), locale)

	return [
		{
			items: [
				{
					href: withLocale(DASHBOARD_URL.home(''), locale),
					icon: HomeIcon,
					labelKey: 'components.dashboard.nav.home',
				},
				{
					href: withLocale(DASHBOARD_URL.announcements(), locale),
					icon: Search,
					labelKey: 'components.dashboard.nav.announcements',
				},
				{
					href: deskHref,
					icon: Package,
					labelKey: 'components.dashboard.nav.desk',
				},
				{
					href: transportationHref,
					icon: Layers3,
					labelKey: 'components.dashboard.nav.transportation',
				},
				{
					href: withLocale(DASHBOARD_URL.rating(), locale),
					icon: CircleStar,
					labelKey: 'components.dashboard.nav.rating',
				},
				{
					href: withLocale(DASHBOARD_URL.history(), locale),
					icon: Clock,
					labelKey: 'components.dashboard.nav.history',
				},
				{
					href: withLocale(DASHBOARD_URL.home('settings'), locale),
					icon: Settings,
					labelKey: 'components.dashboard.nav.settings',
				},
			],
		},
		{
			items: [],
		},
	]
}
