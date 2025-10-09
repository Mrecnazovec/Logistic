import { DASHBOARD_URL } from '@/config/url.config'
import Link from 'next/link'

export function Logo() {
	return <Link href={DASHBOARD_URL.home()} className='flex items-center justify-center font-bold text-xl'>LOGO</Link>
}
