import { redirect } from 'next/navigation'
import { defaultLocale } from '@/i18n/config'
import { addLocaleToPath } from '@/i18n/paths'

export default function Page() {
	redirect(addLocaleToPath('/', defaultLocale))
}
