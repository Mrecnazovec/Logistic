import { Layers3, Package, Search, Settings, SquareKanban } from 'lucide-react'
import { DASHBOARD_URL } from '@/config/url.config'

export const navItems = [
	{
		group: 'Главная',
		items: [
			{
				href: DASHBOARD_URL.home('cabinet'),
				icon: SquareKanban,
				label: 'Аналитика',
			},
			{
				href: DASHBOARD_URL.announcements(),
				icon: Search,
				label: 'Доска объявлений',
			},
			{
				href: DASHBOARD_URL.desk(),
				icon: Package,
				label: 'Заявки',
			},
			{
				href: DASHBOARD_URL.transportation(),
				icon: Layers3,
				label: 'Мои грузы',
			},
		],
	},
	{
		group: 'Настройки',
		items: [
			{
				href: DASHBOARD_URL.home('settings'),
				icon: Settings,
				label: 'Настройки',
			},
		],
	},
]
