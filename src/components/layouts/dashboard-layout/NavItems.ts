import type { LucideIcon } from 'lucide-react'
import { CircleStar, Clock, Layers3, Package, Search, Settings } from 'lucide-react'

import { DASHBOARD_URL } from '@/config/url.config'
import { RoleEnum } from '@/shared/enums/Role.enum'

type RoleGuard = RoleEnum[] | ((role?: RoleEnum) => boolean)

export interface NavItem {
	href: string
	icon: LucideIcon
	label: string
	roles?: RoleGuard
}

export interface NavGroup {
	group?: string
	items: NavItem[]
	roles?: RoleGuard
}

export const navItems: NavGroup[] = [
	{
		items: [
			{
				href: DASHBOARD_URL.announcements(),
				icon: Search,
				label: 'Доска объявлений',
			},
			{
				href: DASHBOARD_URL.desk(),
				icon: Package,
				label: 'Торговля',
			},
			{
				href: DASHBOARD_URL.transportation(),
				icon: Layers3,
				label: 'Мои грузы',
			},
			{
				href: DASHBOARD_URL.rating(),
				icon: CircleStar,
				label: 'Рейтинг',
			},
			{
				href: DASHBOARD_URL.history(),
				icon: Clock,
				label: 'История',
			},
			{
				href: DASHBOARD_URL.home('settings'),
				icon: Settings,
				label: 'Настройки',
			},
		],
	},
	{
		// group: 'Настройки',
		items: [],
	},
]
