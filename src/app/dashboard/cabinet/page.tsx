import type { Metadata } from 'next'
import { Cabinet } from './Cabinet'

export const metadata: Metadata = {
	title: 'Личный кабинет',
}

export default function page() {
	return <Cabinet />
}