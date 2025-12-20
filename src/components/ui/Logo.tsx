import { DASHBOARD_URL, IMG_URL } from '@/config/url.config'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
	href?: string
	className?: string
}

export function Logo({ href = DASHBOARD_URL.home(), className }: LogoProps) {
	return (
		<Link href={href} className={cn('flex items-center justify-center font-bold text-xl', className)}>
			<Image src={IMG_URL.svg('Logo')} alt='KAD' width={76} height={45} />
		</Link>
	)
}
