import type { Metadata } from 'next'

import { InvitePage } from './InvitePage'

export const metadata: Metadata = {
	title: 'Приглашение в заказ',
}

export default function Page() {
	return <InvitePage />
}
