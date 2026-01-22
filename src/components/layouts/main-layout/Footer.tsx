import { Container } from '@/components/ui/Container'
import { Instagram } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const socialLinks = [
	{ label: 'Instagram', href: '#', Icon: Instagram },
	{ label: 'WhatsApp', href: '#', iconPath: '/svg/whatsapp.svg' },
	{ label: 'Telegram', href: '#', iconPath: '/svg/telegram.svg' },
]

export function Footer() {
	return (
		<footer className='bg-white pb-10'>
			<Container>
				<div className='flex items-center gap-3'>
					{socialLinks.map(({ label, href, Icon, iconPath }) => (
						<Link
							key={label}
							href={href}
							aria-label={label}
							className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eef0f4] text-[#0f172a] transition-colors hover:bg-[#e2e8f0]'
						>
							{Icon ? (
								<Icon className='size-5' />
							) : (
								<Image src={iconPath ?? ''} alt='' width={20} height={20} />
							)}
						</Link>
					))}
				</div>
			</Container>
		</footer>
	)
}
