'use client'

import { Button } from '@/components/ui/Button'
import { DASHBOARD_URL } from '@/config/url.config'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { Loader2, Mail, Search, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export function Header() {
	const navList = [
		{ href: DASHBOARD_URL.home(), label: 'Поиск грузоперевозок' },
		{ href: DASHBOARD_URL.home(), label: 'Мои предложения' },
		{ href: DASHBOARD_URL.home(), label: 'Публикация заявки' },
		{ href: DASHBOARD_URL.home(), label: 'Доска заявок' },
	]
	const [isActive, setIsActive] = useState<number>(0)
	const { me, isLoading } = useGetMe()
	return (
		<header className='h-24 flex items-center justify-between pl-10 pr-15 bg-white border-b shadow-lg'>
			<div className='flex items-center gap-6 self-end'>
				<nav className='hidden md:flex gap-6 font-medium text-gray-700'>
					{navList.map((item, index) => (
						<Link href={item.href} key={index} className={`${isActive === index && 'border-b-4 border-b-brand'}`}>
							{item.label}
						</Link>
					))}
				</nav>
			</div>

			<div className='flex items-center gap-9'>
				<Link href={DASHBOARD_URL.home()}>
					<Button size='icon' className='rounded-[13.5px] bg-brand/20 hover:bg-brand/10 size-9'>
						<Mail className='size-5 text-brand' />
					</Button>
				</Link>
				{isLoading ? (
					<Loader2 className='size-5 animate-spin' />
				) : (
					<div className='flex items-center gap-3'>
						{me?.photo ? (
							<Image src={me.photo} width={28} height={28} className='size-7 rounded-full' alt={me.username} />
						) : (
							<div className='rounded-full bg-brand/20 size-9 centred'>
								<User className='size-5 text-brand' />
							</div>
						)}
						<p className='font-medium text-base'>{me?.first_name}</p>
					</div>
				)}
			</div>
		</header>
	)
}
