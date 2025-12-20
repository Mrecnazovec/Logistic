import { Metadata } from 'next'
import { HomePage } from './HomePage'

export const metadata: Metadata = {
	title: 'Добро пожаловать в'
}

export default function page() {
	return <HomePage />
}
