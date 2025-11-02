import { DASHBOARD_URL } from '@/config/url.config'

export interface HeaderNavItem {
	label: string
	href: string
}

interface HeaderNavDefinition {
	matcher: (pathname: string) => boolean
	items: HeaderNavItem[]
}

const normalizePath = (path: string) => {
	if (!path) return '/'
	const trimmed = path.replace(/\/+$/, '')
	return trimmed.length > 0 ? trimmed : '/'
}

const headerNavDefinitions: HeaderNavDefinition[] = [
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/announcements'),
		items: [
			{
				label: 'Поиск грузоперевозок',
				href: DASHBOARD_URL.announcements(),
			},
			{
				label: 'Публикация заявки',
				href: DASHBOARD_URL.posting(),
			},
		],
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/desk'),
		items: [
			{
				label: 'Доска заявок',
				href: DASHBOARD_URL.desk(),
			},
			{
				label: 'Мои предложения',
				href: DASHBOARD_URL.desk('my'),
			},
		],
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/cabinet'),
		items: [
			{
				label: 'Профиль',
				href: DASHBOARD_URL.cabinet(),
			},
		],
	},
]

export const resolveHeaderNavItems = (pathname: string) => {
	const normalizedPath = normalizePath(pathname)
	const matchedDefinition = headerNavDefinitions.find((config) => config.matcher(normalizedPath))

	if (!matchedDefinition) return []

	const itemsWithMatch = matchedDefinition.items.map((item) => {
		const normalizedHref = normalizePath(item.href)
		const matches =
			normalizedPath === normalizedHref ||
			normalizedPath.startsWith(`${normalizedHref}/`)

		return {
			...item,
			matchLength: matches ? normalizedHref.length : -1,
		}
	})

	const maxMatchLength = Math.max(...itemsWithMatch.map((item) => item.matchLength))

	return itemsWithMatch.map(({ matchLength, ...item }) => ({
		...item,
		active: matchLength >= 0 && matchLength === maxMatchLength,
	}))
}
