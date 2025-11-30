import { DASHBOARD_URL, IMG_URL } from '@/config/url.config'
import Image from 'next/image'
import Link from 'next/link'

export function Logo() {
	return <Link href={DASHBOARD_URL.home()} className='flex items-center justify-center font-bold text-xl'>
		<Image src={IMG_URL.svg('Logo')} alt='KAD' width={76} height={45} />
	</Link>
}
