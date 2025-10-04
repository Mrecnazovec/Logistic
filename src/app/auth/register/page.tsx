import { Metadata } from 'next'
import { RegisterPage } from './RegisterPage'

export const metadata: Metadata = {
	title: 'Регистрация',
}

export default function page() {
	return <RegisterPage />
}
