'use client'

import { Button } from '@/components/ui/Button'
import { NoPhoto } from '@/components/ui/NoPhoto'
import { DASHBOARD_URL } from '@/config/url.config'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { cn } from '@/lib/utils'
import { Loader2, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
	const navList = [
		{ href: DASHBOARD_URL.announcements(), label: 'Поиск грузоперевозок' },
		{ href: DASHBOARD_URL.posting(), label: 'Публикация заявки' },
		{ href: DASHBOARD_URL.desk(), label: 'Доска заявок' },
		{ href: DASHBOARD_URL.desk('my'), label: 'Мои предложения' },
		{ href: DASHBOARD_URL.transportation(), label: 'Заказы' },
		{ href: DASHBOARD_URL.transportation('my'), label: 'Везу' },
		{ href: DASHBOARD_URL.home('cabinet/'), label: 'Профиль' },
	]

	const { me, isLoading } = useGetMe()
	const pathname = usePathname()
	const filteredPathname = `${pathname}/`

	let filteredNavList = navList
	if (filteredPathname.startsWith(DASHBOARD_URL.announcements())) {
		filteredNavList = navList.slice(0, 2)
	} else if (filteredPathname.startsWith(DASHBOARD_URL.desk())) {
		filteredNavList = navList.slice(2, 4)
	} else if (filteredPathname.startsWith(DASHBOARD_URL.transportation())) {
		filteredNavList = navList.slice(4)
	} else if (filteredPathname.startsWith(DASHBOARD_URL.home('cabinet'))) {
		filteredNavList = navList.slice(6)
	}
	else {
		filteredNavList = []
	}

	return (
		<header className='h-24 flex items-center xs:justify-between justify-center md:pl-10 md:pr-15 bg-white border-b shadow-lg px-4 max-xs:pt-4 max-xs:flex-col-reverse gap-4'>
			<div className='flex items-center gap-6 max-xs:self-start'>
				<nav className='flex gap-6 font-medium text-gray-700'>
					{filteredNavList.map((item, index) => (
						<Link href={item.href} key={index} className={cn(`${filteredPathname === item.href && 'border-b-4 border-b-brand'}`, 'max-md:text-xs text-center')}>
							{item.label}
						</Link>
					))}
				</nav>
			</div>

			<div className='flex items-center md:gap-9 gap-3 max-xs:self-end'>
				<Link href={DASHBOARD_URL.home()}>
					<Button size='icon' className='rounded-[13.5px] bg-brand/20 hover:bg-brand/10 size-9'>
						<Mail className='size-5 text-brand' />
					</Button>
				</Link>
				{isLoading ? (
					<Loader2 className='size-5 animate-spin' />
				) : (
					<Link href={DASHBOARD_URL.home('cabinet')} className='flex items-center gap-3'>
						{me?.photo ? (
							<Image src={me.photo} width={28} height={28} className='size-7 rounded-full' alt={me.username} />
						) : (
							<NoPhoto />
						)}
						<p className='font-medium text-base max-md:hidden'>{me?.first_name ? me?.first_name : 'Пользователь'}</p>
					</Link>
				)}
			</div>
		</header>
	)
}
