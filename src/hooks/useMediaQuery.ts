import { useSyncExternalStore } from 'react'

const getServerSnapshot = () => false

export function useMediaQuery(query: string) {
	return useSyncExternalStore(
		(callback) => {
			if (typeof window === 'undefined') {
				return () => undefined
			}

			const media = window.matchMedia(query)
			const listener = () => callback()
			media.addEventListener('change', listener)
			return () => media.removeEventListener('change', listener)
		},
		() => (typeof window === 'undefined' ? false : window.matchMedia(query).matches),
		getServerSnapshot,
	)
}
