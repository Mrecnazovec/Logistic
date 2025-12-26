import { Metadata } from 'next'
import { AuthPage } from './AuthPage'
import { Suspense } from 'react'

export const metadata: Metadata = {
	title: 'Авторизация',
}

export default function page() {
	return <Suspense><AuthPage /></Suspense>
}
