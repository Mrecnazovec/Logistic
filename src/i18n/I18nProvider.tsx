'use client'

import { createContext, useContext, useMemo } from 'react'
import type { Locale } from './config'
import type { Messages } from './messages'

type TranslateParams = Record<string, string | number>

type I18nContextValue = {
	locale: Locale
	t: (key: string, params?: TranslateParams) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const interpolate = (template: string, params?: TranslateParams) => {
	if (!params) return template
	return template.replace(/\{(\w+)\}/g, (_, key: string) => {
		const value = params[key]
		return value === undefined ? `{${key}}` : String(value)
	})
}

export function I18nProvider({
	locale,
	messages,
	children,
}: {
	locale: Locale
	messages: Messages
	children: React.ReactNode
}) {
	const value = useMemo<I18nContextValue>(() => {
		return {
			locale,
			t: (key: string, params?: TranslateParams) => interpolate(messages[key] ?? key, params),
		}
	}, [locale, messages])

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => {
	const context = useContext(I18nContext)
	if (!context) {
		throw new Error('useI18n must be used within I18nProvider')
	}
	return context
}
