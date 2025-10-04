export const APP_URL = process.env.APP_URL as string

export const PUBLIC_URL = {
	root: (url = '') => `${url ? url : ''}`,
}

export const DASHBOARD_URL = {
	root: (url = '') => `${url ? url : ''}`,
}

export const IMG_URL = {
	root: (url = '') => `${url ? url : ''}`,

	svg: (url = '') => `/svg/${url ? url : ''}.svg`,
	png: (url = '') => `/png/${url ? url : ''}.png`,
	jpg: (url = '') => `/jpg/${url ? url : ''}.jpg`,
}