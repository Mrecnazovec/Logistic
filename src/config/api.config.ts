export const SERVER_URL = process.env.SERVER_URL as string

export const API_URL = {
	root: (url = '') => `${url ? url : ''}`,

	auth: (url = '') => API_URL.root(`auth/${url}/`),
	loads: (url = '') => API_URL.root(`loads/${url}/`),
	offers: (url = '') => API_URL.root(`offers/${url}/`),
}
