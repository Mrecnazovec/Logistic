import { AxiosError } from 'axios'

const pickMessage = (value: unknown): string | undefined => {
	if (typeof value === 'string') return value

	if (Array.isArray(value)) {
		const parts = value.filter((item): item is string => typeof item === 'string')
		if (parts.length) return parts.join(' ')
	}

	if (value && typeof value === 'object') {
		const nestedValue = Object.values(value)[0]
		return pickMessage(nestedValue)
	}

	return undefined
}

export const getErrorMessage = (error: unknown): string | undefined => {
	const err = error as AxiosError<unknown>
	const data = err.response?.data

	if (!data) return err.message

	if (typeof data === 'string') return data

	if (typeof data === 'object') {
		return pickMessage(data)
	}

	return undefined
}
