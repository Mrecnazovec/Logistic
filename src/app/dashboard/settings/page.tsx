import { Metadata } from 'next'
import { SettingPage } from './SettingPage'

export const metadata: Metadata = {
	title: 'Настройки',
}

export default function page() {
	return <SettingPage />
}
