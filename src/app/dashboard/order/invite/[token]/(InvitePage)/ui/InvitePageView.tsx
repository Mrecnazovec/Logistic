'use client'

import { useSyncExternalStore } from 'react'
import { useI18n } from '@/i18n/I18nProvider'
import { InvitePageContent } from './InvitePageContent'
import { InvitePageFallback } from './InvitePageFallback'

export function InvitePageView() {
	const { t } = useI18n()
	const isHydrated = useSyncExternalStore(
		(callback) => {
			callback()
			return () => {}
		},
		() => true,
		() => false,
	)

	if (!isHydrated) {
		return <InvitePageFallback t={t} />
	}

	return <InvitePageContent />
}
