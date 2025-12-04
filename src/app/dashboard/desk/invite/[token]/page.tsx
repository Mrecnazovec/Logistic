import type { Metadata } from 'next'
import { InvitePage } from './InvitePage'


export const metadata: Metadata = {
	title: 'Приглашение по ссылке',
}

export default function Page() {
	return <InvitePage />

}
