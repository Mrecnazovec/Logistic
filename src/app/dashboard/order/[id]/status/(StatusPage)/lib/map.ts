declare global {
	interface Window {
		ymaps?: any
		__yandexMapsPromise?: Promise<any>
	}
}

export const resolveYandexLang = (locale: string) => (locale === 'en' ? 'en_US' : 'ru_RU')

export const loadYandexMaps = (apiKey: string, lang: string) => {
	if (window.ymaps) return Promise.resolve(window.ymaps)
	if (window.__yandexMapsPromise) return window.__yandexMapsPromise

	window.__yandexMapsPromise = new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=${lang}`
		script.async = true
		script.onload = () => {
			if (!window.ymaps) {
				reject(new Error('Yandex Maps API did not initialize'))
				return
			}
			window.ymaps.ready(() => resolve(window.ymaps))
		}
		script.onerror = () => reject(new Error('Failed to load Yandex Maps API'))
		document.head.appendChild(script)
	})

	return window.__yandexMapsPromise.catch((error) => {
		window.__yandexMapsPromise = undefined
		throw error
	})
}

export const ensureYandexMultiRouterModule = (ymaps: any) =>
	new Promise<void>((resolve, reject) => {
		if (typeof ymaps?.multiRouter?.MultiRoute === 'function') {
			resolve()
			return
		}

		if (!ymaps?.modules?.require) {
			reject(new Error('Yandex Maps route module loader is unavailable'))
			return
		}

		ymaps.modules.require(
			['multiRouter.MultiRoute'],
			() => resolve(),
			(error: unknown) => reject(error instanceof Error ? error : new Error('Failed to load Yandex MultiRoute module')),
		)
	})

export const buildPointQuery = (city?: string | null, address?: string | null) => [city, address].filter(Boolean).join(', ')
