'use client'

import { Button } from '@/components/ui/Button'
import { NoPhoto } from '@/components/ui/NoPhoto'
import { resolveHeaderNavItems } from './HeaderNavConfig'
import { DASHBOARD_URL } from '@/config/url.config'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { cn } from '@/lib/utils'
import { Loader2, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

export function Header() {
	const pathname = usePathname()
	const navItems = useMemo(() => resolveHeaderNavItems(pathname), [pathname])
	const { me, isLoading } = useGetMe()

	return (
		<header className='h-24 flex items-center xs:justify-between md:pl-10 md:pr-15 bg-white border-b shadow-lg px-4 max-xs:pt-4 max-xs:flex-col-reverse gap-4'>
			<div className='flex items-center gap-6 xs:self-end self-start'>
				{navItems.length > 0 && (
					<nav className='flex gap-6 font-medium text-gray-700'>
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									'pb-2 border-b-4 max-md:text-xs text-center transition-colors',
									item.active
										? 'border-b-brand text-brand font-semibold'
										: 'border-b-transparent hover:text-brand/70'
								)}
							>
								{item.label}
							</Link>
						))}
					</nav>
				)}
			</div>

			<div className='flex items-center md:gap-9 gap-3 max-xs:self-end'>


				{isLoading ? (
					<Loader2 className='size-5 animate-spin' />
				) : (
					<><Link href={DASHBOARD_URL.home()}>
						<Button
							size='icon'
							className='rounded-[13.5px] bg-brand/20 hover:bg-brand/10 size-9'
						>
							<Mail className='size-5 text-brand' />
						</Button>
					</Link>
						<Link
							href={DASHBOARD_URL.cabinet()}
							className='flex items-center gap-3'
						>
							{me?.photo ? (
								<Image
									src={me.photo}
									width={28}
									height={28}
									className='size-7 rounded-full object-cover'
									alt={me.username}
								/>
							) : (
								<NoPhoto />
							)}
							<p className='font-medium text-base max-md:hidden'>
								{me?.first_name || 'Пользователь'}
							</p>
						</Link></>
				)}
			</div>
		</header>
	)
}
