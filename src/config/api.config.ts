export const SERVER_URL = process.env.SERVER_URL as string

export const API_URL = {
	root: (url = '') => `${url ? url : ''}`,

	auth: (url = '') => API_URL.root(`auth/${url}/`),
	agreements: (url = '') => API_URL.root(`agreements/${url}`),
	loads: (url = '') => API_URL.root(`loads/${url}/`),
	offers: (url = '') => API_URL.root(`offers/${url}`),
	orders: (url = '') => API_URL.root(`orders/${url}/`),
	payments: (url = '') => API_URL.root(`payments/${url}/`),
	ratings: (url = '') => API_URL.root(`ratings/${url}`),
	support: (url = '') => API_URL.root(`support/${url}`),
}
