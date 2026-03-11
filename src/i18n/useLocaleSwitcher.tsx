'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { startTransition } from 'react'
import type { Locale } from './config'
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
		startTransition(() => {
			router.replace(nextPath)
		})
	}

	return { switchLocale }
}
