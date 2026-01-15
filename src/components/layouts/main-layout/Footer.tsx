import { Container } from '@/components/ui/Container'
import { Dribbble, Instagram, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'

const socialLinks = [
	{ label: 'Instagram', href: '#', Icon: Instagram },
	{ label: 'Dribbble', href: '#', Icon: Dribbble },
	{ label: 'Twitter', href: '#', Icon: Twitter },
	{ label: 'YouTube', href: '#', Icon: Youtube },
]

export function Footer() {
	return (
		<footer className='bg-white pb-10'>
			<Container>
				<div className='flex items-center gap-3'>
					{socialLinks.map(({ label, href, Icon }) => (
						<Link
							key={label}
							href={href}
							aria-label={label}
							className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eef0f4] text-[#0f172a] transition-colors hover:bg-[#e2e8f0]'
						>
							<Icon className='size-5' />
						</Link>
					))}
				</div>
			</Container>
		</footer>
	)
}
