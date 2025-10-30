import { DASHBOARD_URL } from '@/config/url.config'

export const NAV_CONFIG = {
	announcements: [
		{ label: 'Поиск грузоперевозок', href: DASHBOARD_URL.announcements() },
		{ label: 'Публикация заявки', href: DASHBOARD_URL.posting() },
	],
	desk: [
		{ label: 'Доска заявок', href: DASHBOARD_URL.desk() },
		{ label: 'Мои предложения', href: DASHBOARD_URL.desk('my') },
	],
	transportation: [
		{ label: 'Заказы', href: DASHBOARD_URL.transportation() },
		{ label: 'Везу', href: DASHBOARD_URL.transportation('my') },
	],
	profile: [{ label: 'Профиль', href: DASHBOARD_URL.cabinet() }],
	edit: [{ label: 'Редактирование заявки', href: DASHBOARD_URL.edit() }],
}
