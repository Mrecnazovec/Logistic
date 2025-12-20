import { AxiosError } from 'axios'

const pickMessage = (value: unknown): string | undefined => {
	if (typeof value === 'string') return value

	if (Array.isArray(value)) {
		const parts = value.filter((item): item is string => typeof item === 'string')
		if (parts.length) return parts.join(' ')
	}

	if (value && typeof value === 'object') {
		const values = Object.values(value)
		for (const nestedValue of values) {
			const message = pickMessage(nestedValue)
			if (message) return message
		}
	}

	return undefined
}

export const getErrorMessage = (error: unknown): string | undefined => {
	const err = error as AxiosError<unknown>
	const data = err.response?.data

	

	if (!data) return err.message

	if (typeof data === 'string') {
		const trimmed = data.trim()
		if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
			try {
				return pickMessage(JSON.parse(trimmed))
			} catch {
				return data
			}
		}
		return data
	}

	if (typeof data === 'object') {
		return pickMessage(data)
	}

	return undefined
}
