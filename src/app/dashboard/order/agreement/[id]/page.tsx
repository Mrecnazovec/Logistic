import { Metadata } from 'next'
import { AgreementPage } from './AgreementPage'

export const metadata: Metadata = {
	title: 'Соглашение',
}

export default function page() {
	return <AgreementPage />
}
