import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay = 300): T {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		if (delay <= 0) return

		const handler = window.setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			window.clearTimeout(handler)
		}
	}, [value, delay])

	return delay <= 0 ? value : debouncedValue
}
