import { DASHBOARD_URL } from '@/config/url.config'
import { RoleEnum } from '@/shared/enums/Role.enum'

export interface HeaderNavItem {
	label: string
	href: string
}

export interface HeaderNavBackLink {
	label: string
	href: string
}

interface HeaderNavDefinition {
	matcher: (pathname: string) => boolean
	items: HeaderNavItem[] | ((pathname: string) => HeaderNavItem[])
	backLink?: HeaderNavBackLink | ((pathname: string) => HeaderNavBackLink | null)
	roles?: RoleEnum[] | ((role?: RoleEnum) => boolean)
}

export interface ResolvedHeaderNavItems {
	items: (HeaderNavItem & { active: boolean })[]
	backLink: HeaderNavBackLink | null
}

const normalizePath = (path: string) => {
	if (!path) return '/'
	const trimmed = path.replace(/\/+$/, '')
	return trimmed.length > 0 ? trimmed : '/'
}

const getOrderIdFromPath = (pathname: string) => {
	const normalizedPath = normalizePath(pathname)
	const segments = normalizedPath.split('/').filter(Boolean)

	if (segments.length < 3) return null

	const [section, resource, orderId] = segments

	if (section !== 'dashboard' || resource !== 'order') return null
	if (!orderId || orderId === '[id]') return null

	return orderId
}

const headerNavDefinitions: HeaderNavDefinition[] = [
	// Customer start
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/announcements/posting'),
		roles: [RoleEnum.CUSTOMER],
		items: [
			{
				label: 'Доска заявок',
				href: DASHBOARD_URL.desk(),
			},
			{
				label: 'Публикация заявки',
				href: DASHBOARD_URL.posting(),
			},
		],
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/desk'),
		roles: [RoleEnum.CUSTOMER],
		items: [
			{
				label: 'Доска заявок',
				href: DASHBOARD_URL.desk(),
			},
			{
				label: 'Публикация заявки',
				href: DASHBOARD_URL.posting(),
			},
			{
				label: 'Мои предложения',
				href: DASHBOARD_URL.desk('my'),
			},
		],
	},
	// Customer end

	// Carrier start
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/announcements'),
		roles: [RoleEnum.CARRIER],
		items: [
			{
				label: 'Поиск грузоперевозок',
				href: DASHBOARD_URL.announcements(),
			},
			{
				label: 'Мои предложения',
				href: DASHBOARD_URL.desk('my'),
			},
		],
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/desk'),
		roles: [RoleEnum.CARRIER],
		items: [
			{
				label: 'Поиск грузоперевозок',
				href: DASHBOARD_URL.announcements(),
			},
			{
				label: 'Мои предложения',
				href: DASHBOARD_URL.desk('my'),
			},
		],
	},
	// Carrier end
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
		matcher: (pathname) => Boolean(getOrderIdFromPath(pathname)),
		items: (pathname) => {
			const orderId = getOrderIdFromPath(pathname)

			if (!orderId) return []

			const basePath = orderId

			return [
				{
					label: 'Детали',
					href: DASHBOARD_URL.order(basePath),
				},
				{
					label: 'Документы',
					href: DASHBOARD_URL.order(`${basePath}/docs`),
				},
				{
					label: 'Статусы',
					href: DASHBOARD_URL.order(`${basePath}/status`),
				},
			]
		},
		backLink: {
			label: 'Назад к моим грузам',
			href: DASHBOARD_URL.transportation(),
		},
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/transportation'),
		items: [
			{
				label: 'Заказы',
				href: DASHBOARD_URL.transportation(),
			},
			{
				label: 'Везу',
				href: DASHBOARD_URL.transportation('my'),
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
		backLink: {
			label: 'Назад к списку объявлений',
			href: DASHBOARD_URL.announcements(),
		},
	},
]

export const resolveHeaderNavItems = (pathname: string, role?: RoleEnum): ResolvedHeaderNavItems => {
	const normalizedPath = normalizePath(pathname)
	const matchedDefinition = headerNavDefinitions.find((config) => {
		if (config.roles) {
			const allowed = Array.isArray(config.roles) ? (role ? config.roles.includes(role) : false) : config.roles(role)

			if (!allowed) {
				return false
			}
		}

		return config.matcher(normalizedPath)
	})

	if (!matchedDefinition) {
		return {
			items: [],
			backLink: null,
		}
	}

	const resolvedItems = Array.isArray(matchedDefinition.items) ? matchedDefinition.items : matchedDefinition.items(normalizedPath)

	const resolvedBackLink = matchedDefinition.backLink
		? typeof matchedDefinition.backLink === 'function'
			? matchedDefinition.backLink(normalizedPath)
			: matchedDefinition.backLink
		: null

	if (!resolvedItems.length) {
		return {
			items: [],
			backLink: resolvedBackLink,
		}
	}

	const itemsWithMatch = resolvedItems.map((item) => {
		const normalizedHref = normalizePath(item.href)
		const matches = normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`)

		return {
			...item,
			matchLength: matches ? normalizedHref.length : -1,
		}
	})

	const maxMatchLength = Math.max(...itemsWithMatch.map((item) => item.matchLength))

	return {
		items: itemsWithMatch.map(({ matchLength, ...item }) => ({
			...item,
			active: matchLength >= 0 && matchLength === maxMatchLength,
		})),
		backLink: resolvedBackLink,
	}
}
