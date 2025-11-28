export const APP_URL = process.env.APP_URL as string

export const PUBLIC_URL = {
	root: (url = '') => `${url ? url : ''}`,

	home: (url = '') => `/${url}`,
	auth: (url = '') => `/auth/${url}`,
}

export const DASHBOARD_URL = {
	root: (url = '') => `${url ? url : ''}`,

	home: (url = '') => `/dashboard/${url}`,
	cabinet: () => `/dashboard/cabinet/`,
	announcements: (url = '') => `/dashboard/announcements/${url}`,
	desk: (url = '') => `/dashboard/desk/${url}`,
	transportation: (url = '') => `/dashboard/transportation/${url}`,
	order: (url = '') => `/dashboard/order/${url}`,
	rating: (url = '') => `/dashboard/rating/${url}`,
	history: (url = '') => `/dashboard/history/${url}`,
	notifications: (url = '') => `/dashboard/notifications/${url}`,

	posting: (url = '') => `/dashboard/announcements/posting/${url}`,
	edit: (url = '') => `/dashboard/desk/edit/${url}`,
}

export const IMG_URL = {
	root: (url = '') => `${url ? url : ''}`,

	svg: (url = '') => `/svg/${url ? url : ''}.svg`,
	png: (url = '') => `/png/${url ? url : ''}.png`,
	jpg: (url = '') => `/jpg/${url ? url : ''}.jpg`,
}
