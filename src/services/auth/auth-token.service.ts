import Cookies from 'js-cookie'

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

export const saveTokenStorage = (accessToken: string, refreshToken?: string) => {
	Cookies.set(Tokens.ACCESS_TOKEN, accessToken, {
		domain: process.env.APP_DOMAIN,
		sameSite: 'strict',
		expires: 1,
	})

	if (refreshToken) {
		Cookies.set(Tokens.REFRESH_TOKEN, refreshToken, {
			domain: process.env.APP_DOMAIN,
			sameSite: 'strict',
			expires: 7,
		})
	}
}

export const removeFromStorage = () => {
	Cookies.remove(Tokens.ACCESS_TOKEN, { domain: process.env.APP_DOMAIN })
	Cookies.remove(Tokens.REFRESH_TOKEN, { domain: process.env.APP_DOMAIN })
}
