'use client'

import { Suspense, useSyncExternalStore } from 'react'
import { useInvitePage } from './hooks/useInvitePage'
import { InvitePageFallback, InviteView } from './ui/InviteView'

export function InvitePage() {
	const isHydrated = useSyncExternalStore(
		(callback) => {
			callback()
			return () => {}
		},
		() => true,
		() => false,
	)

	if (!isHydrated) {
		return <InvitePageFallback />
	}

	return (
		<Suspense fallback={<InvitePageFallback />}>
			<InvitePageContent />
		</Suspense>
	)
}

function InvitePageContent() {
	const state = useInvitePage()
	return <InviteView {...state} />
}
