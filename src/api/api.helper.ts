import { AxiosError } from 'axios'

export const getContentType = () => ({
	'Content-type': 'application/json',
})

export const errorCatch = (error: unknown): string => {
	const err = error as AxiosError<{ message?: string | string[] }>
	const message = err.response?.data?.message

	return message ? (Array.isArray(message) ? message[0] : message) : err.message || 'Unknown error'
}
