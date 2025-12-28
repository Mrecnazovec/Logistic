import { IMG_URL } from '@/config/url.config'
import type { Locale } from './config'

export type LanguageOption = {
	code: Locale
	label: string
	flag: string
}

export const languageOptions: LanguageOption[] = [
	{ code: 'ru', label: 'Русский', flag: IMG_URL.svg('rus') },
	{ code: 'en', label: 'English', flag: IMG_URL.svg('eng') },
	{ code: 'uz', label: 'Uzbek', flag: IMG_URL.svg('uzb') },
]

