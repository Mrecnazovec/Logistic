import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'

export function Header() {
	return (
		<header className='border-b border-slate-100 bg-white/90 backdrop-blur'>
			<Container className='flex items-center justify-between gap-6 py-4'>
				<Logo href='/' className='justify-start' />
				<Button asChild size='sm'>
					<Link href='/auth'>Войти</Link>
				</Button>
			</Container>
		</header>
	)
}
