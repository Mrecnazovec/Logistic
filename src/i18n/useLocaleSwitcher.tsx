'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Cookies from 'js-cookie'
import type { Locale } from './config'
import { localeCookie } from './config'
import { addLocaleToPath, getLocaleFromPath } from './paths'

export const useLocaleSwitcher = () => {
	const router = useRouter()
	const pathname = usePathname() ?? '/'
	const searchParams = useSearchParams()

	const switchLocale = (nextLocale: Locale) => {
		if (getLocaleFromPath(pathname) === nextLocale) {
			return
		}
		const query = searchParams.toString()
		const nextPath = `${addLocaleToPath(pathname, nextLocale)}${query ? `?${query}` : ''}`
		Cookies.set(localeCookie, nextLocale, { path: '/' })
		if (typeof window !== 'undefined') {
			window.location.assign(nextPath)
			return
		}
		router.replace(nextPath)
	}

	return { switchLocale }
}
