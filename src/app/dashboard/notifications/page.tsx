import type { Metadata } from 'next'
import { Notifications } from './Notifications'

export const metadata: Metadata = {
	title: 'Уведомления',
}

export default function Page() {
	return <Notifications />
}
