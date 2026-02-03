import Cookies from 'js-cookie'

type CookieAttributes = Parameters<typeof Cookies.withAttributes>[0]

export const Tokens = {
	ACCESS_TOKEN: 'accessToken',
	REFRESH_TOKEN: 'refreshToken',
} as const

export const getAccessToken = () => {
	return Cookies.get(Tokens.ACCESS_TOKEN) || null
}

export const getRefreshToken = () => {
	return Cookies.get(Tokens.REFRESH_TOKEN) || null
}

const sanitizeDomain = (domain?: string | null) => {
	if (!domain) return undefined

	const cleaned = domain
		.replace(/^https?:\/\//, '')
		.split(':')[0]
		?.trim()
	if (!cleaned || cleaned === 'localhost' || cleaned === '127.0.0.1') {
		return undefined
	}

	return cleaned
}

const cookieDomain = sanitizeDomain(process.env.APP_DOMAIN)

const baseCookieOptions: CookieAttributes = {
	sameSite: 'strict',
	expires: 30,
}

if (cookieDomain) {
	baseCookieOptions.domain = cookieDomain
}

const removalOptions: CookieAttributes | undefined = cookieDomain ? { domain: cookieDomain } : undefined

export const saveTokenStorage = (accessToken: string) => {
	Cookies.set(Tokens.ACCESS_TOKEN, accessToken, baseCookieOptions)
}

export const saveRefreshTokenStorage = (refreshToken: string) => {
	Cookies.set(Tokens.REFRESH_TOKEN, refreshToken, baseCookieOptions)
}

export const removeFromStorage = () => {
	Cookies.remove(Tokens.ACCESS_TOKEN, removalOptions)
	Cookies.remove(Tokens.REFRESH_TOKEN, removalOptions)
}
