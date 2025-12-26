import { Metadata } from 'next'
import { RegisterPage } from './RegisterPage'
import { Suspense } from 'react'

export const metadata: Metadata = {
	title: 'Регистрация',
}

export default function page() {
	return <Suspense><RegisterPage /></Suspense>
}
