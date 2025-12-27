import { DASHBOARD_URL, withLocale } from '@/config/url.config'
import { getLocaleFromPath, stripLocaleFromPath } from '@/i18n/paths'
import { RoleEnum } from '@/shared/enums/Role.enum'

export interface HeaderNavItem {
	labelKey: string
	href: string
}

export interface HeaderNavBackLink {
	labelKey: string
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

const getOrderDocsFolderInfo = (pathname: string) => {
	const normalizedPath = normalizePath(pathname)
	const match = normalizedPath.match(/^\/dashboard\/order\/([^/]+)\/docs\/([^/]+)$/)

	if (!match) return null

	const [, orderId, folder] = match

	if (!orderId || orderId === '[id]' || !folder || folder === '[folder]') return null

	return { orderId, folder }
}

const getOrderNavItems = (orderId: string): HeaderNavItem[] => {
	const basePath = orderId

	return [
		{
			labelKey: 'components.dashboard.headerNav.order.details',
			href: DASHBOARD_URL.order(basePath),
		},
		{
			labelKey: 'components.dashboard.headerNav.order.docs',
			href: DASHBOARD_URL.order(`${basePath}/docs`),
		},
		{
			labelKey: 'components.dashboard.headerNav.order.statuses',
			href: DASHBOARD_URL.order(`${basePath}/status`),
		},
		{
			labelKey: 'components.dashboard.headerNav.order.payment',
			href: DASHBOARD_URL.order(`${basePath}/payment`),
		},
	]
}

const headerNavDefinitions: HeaderNavDefinition[] = [
	// Customer start
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/announcements/posting'),
		roles: [RoleEnum.CUSTOMER],
		items: [
			{
				labelKey: 'components.dashboard.headerNav.announcements',
				href: DASHBOARD_URL.desk(),
			},
			{
				labelKey: 'components.dashboard.headerNav.posting',
				href: DASHBOARD_URL.posting(),
			},
		],
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/desk'),
		roles: [RoleEnum.CUSTOMER],
		items: [
			{
				labelKey: 'components.dashboard.headerNav.announcements',
				href: DASHBOARD_URL.desk(),
			},
			{
				labelKey: 'components.dashboard.headerNav.posting',
				href: DASHBOARD_URL.posting(),
			},
		],
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/transportation'),
		roles: [RoleEnum.CUSTOMER],
		items: [
			{
				labelKey: 'components.dashboard.headerNav.transportation.search',
				href: DASHBOARD_URL.transportation(),
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
				labelKey: 'components.dashboard.headerNav.announcements',
				href: DASHBOARD_URL.announcements(),
			},
		],
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/desk'),
		roles: [RoleEnum.CARRIER],
		items: [
			{
				labelKey: 'components.dashboard.headerNav.desk.myOffers',
				href: DASHBOARD_URL.desk('my'),
			},
		],
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/transportation'),
		roles: [RoleEnum.CARRIER],
		items: [
			{
				labelKey: 'components.dashboard.headerNav.transportation.carrying',
				href: DASHBOARD_URL.transportation('my'),
			},
		],
	},
	// Carrier end
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/announcements'),
		items: [
			{
				labelKey: 'components.dashboard.headerNav.announcements',
				href: DASHBOARD_URL.announcements(),
			},
			{
				labelKey: 'components.dashboard.headerNav.posting',
				href: DASHBOARD_URL.posting(),
			},
		],
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/order/agreement'),
		items: [
			{
				labelKey: '',
				href: DASHBOARD_URL.profile(),
			},
		],
		backLink: {
			labelKey: 'components.dashboard.headerNav.back.toMyCargo',
			href: DASHBOARD_URL.transportation(),
		},
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/order/invite/'),
		items: [
			{
				labelKey: '',
				href: DASHBOARD_URL.transportation(),
			},
		],
		backLink: {
			labelKey: 'components.dashboard.headerNav.back.toAnnouncements',
			href: DASHBOARD_URL.announcements(),
		},
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/profile'),
		items: [
			{
				labelKey: '',
				href: DASHBOARD_URL.profile(),
			},
		],
		backLink: {
			labelKey: 'components.dashboard.headerNav.back.toAnnouncements',
			href: DASHBOARD_URL.announcements(),
		},
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/desk'),
		items: [
			{
				labelKey: 'components.dashboard.headerNav.announcements',
				href: DASHBOARD_URL.desk(),
			},
			{
				labelKey: 'components.dashboard.headerNav.desk.myOffers',
				href: DASHBOARD_URL.desk('my'),
			},
		],
	},
	{
		matcher: (pathname) => Boolean(getOrderDocsFolderInfo(pathname)),
		items: (pathname) => {
			const orderId = getOrderIdFromPath(pathname)

			if (!orderId) return []

			return getOrderNavItems(orderId)
		},
		backLink: (pathname) => {
			const info = getOrderDocsFolderInfo(pathname)

			if (!info) return null

			return {
				labelKey: 'components.dashboard.headerNav.back.toDocs',
				href: DASHBOARD_URL.order(`${info.orderId}/docs`),
			}
		},
	},
	{
		matcher: (pathname) => Boolean(getOrderIdFromPath(pathname)),
		items: (pathname) => {
			const orderId = getOrderIdFromPath(pathname)

			if (!orderId) return []

			return getOrderNavItems(orderId)
		},
		backLink: {
			labelKey: 'components.dashboard.headerNav.back.toMyCargo',
			href: DASHBOARD_URL.transportation(),
		},
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/transportation'),
		items: [
			{
				labelKey: 'components.dashboard.headerNav.transportation.search',
				href: DASHBOARD_URL.transportation(),
			},
			{
				labelKey: 'components.dashboard.headerNav.transportation.carrying',
				href: DASHBOARD_URL.transportation('my'),
			},
		],
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/rating'),
		items: [
			{
				labelKey: 'components.dashboard.headerNav.rating.logistic',
				href: DASHBOARD_URL.rating(),
			},
			{
				labelKey: 'components.dashboard.headerNav.rating.carrier',
				href: DASHBOARD_URL.rating('carrier'),
			},
			{
				labelKey: 'components.dashboard.headerNav.rating.customer',
				href: DASHBOARD_URL.rating('customer'),
			},
		],
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/cabinet'),
		items: [
			{
				labelKey: 'components.dashboard.headerNav.profile',
				href: DASHBOARD_URL.cabinet(),
			},
		],
		backLink: {
			labelKey: 'components.dashboard.headerNav.back.toAnnouncements',
			href: DASHBOARD_URL.announcements(),
		},
	},
	{
		matcher: (pathname) => normalizePath(pathname).startsWith('/dashboard/settings'),
		items: [
			{
				labelKey: 'components.dashboard.headerNav.profile',
				href: DASHBOARD_URL.settings(),
			},
			{
				labelKey: 'components.dashboard.headerNav.language',
				href: DASHBOARD_URL.settings('language'),
			},
			{
				labelKey: 'components.dashboard.headerNav.support',
				href: DASHBOARD_URL.settings('support'),
			},
			{
				labelKey: 'components.dashboard.headerNav.password',
				href: DASHBOARD_URL.settings('password'),
			},
		],
	},
]

export const resolveHeaderNavItems = (pathname: string, role?: RoleEnum): ResolvedHeaderNavItems => {
	const locale = getLocaleFromPath(pathname) ?? undefined
	const normalizedPath = normalizePath(stripLocaleFromPath(pathname))
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
	const localizedItems = resolvedItems.map((item) => ({
		...item,
		href: withLocale(item.href, locale),
	}))

	const resolvedBackLink = matchedDefinition.backLink
		? typeof matchedDefinition.backLink === 'function'
			? matchedDefinition.backLink(normalizedPath)
			: matchedDefinition.backLink
		: null
	const localizedBackLink = resolvedBackLink
		? {
				...resolvedBackLink,
				href: withLocale(resolvedBackLink.href, locale),
		  }
		: null

	if (!localizedItems.length) {
		return {
			items: [],
			backLink: localizedBackLink,
		}
	}

	const itemsWithMatch = localizedItems.map((item) => {
		const normalizedHref = normalizePath(stripLocaleFromPath(item.href))
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
		backLink: localizedBackLink,
	}
}
