'use client'

import { Search, Settings, SquareKanban } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip'
import { DASHBOARD_URL } from '@/config/url.config'
import { Logo } from '@/components/ui/Logo'

export function Sidebar() {
	return (
		<aside className='w-20 lg:w-32 pt-8 bg-brand-900 text-white flex flex-col rounded-tr-[42px] rounded-br-xl'>
			<Logo />
			<nav className='flex-1 flex flex-col items-center gap-2 mt-8'>
				<p className='font-medium text-[10px] uppercase'>Главная</p>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link className='w-full flex justify-center' href={DASHBOARD_URL.home()}>
							<Button
								variant='ghost'
								className={cn('w-[70%] justify-center text-white hover:bg-white/10 hover:text-white px-6', 'lg:text-base text-sm')}
							>
								<SquareKanban className='size-5 rotate-180' />
							</Button>
						</Link>
					</TooltipTrigger>
					<TooltipContent side='bottom' sideOffset={8}>
						Текст
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link className='w-full flex justify-center' href={DASHBOARD_URL.announcements()}>
							<Button
								variant='ghost'
								className={cn('w-[70%] justify-center text-white hover:bg-white/10 hover:text-white px-6', 'lg:text-base text-sm')}
							>
								<Search className='size-5' />
							</Button>
						</Link>
					</TooltipTrigger>
					<TooltipContent side='bottom' sideOffset={8}>
						Доска объявлений
					</TooltipContent>
				</Tooltip>
				<p className='font-medium text-[10px] uppercase'>Настройки</p>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link className='w-full flex justify-center' href={DASHBOARD_URL.home()}>
							<Button
								variant='ghost'
								className={cn('w-[70%] justify-center text-white hover:bg-white/10 hover:text-white px-6', 'lg:text-base text-sm')}
							>
								<Settings className='size-5' />
							</Button>
						</Link>
					</TooltipTrigger>
					<TooltipContent side='bottom' sideOffset={8}>
						Настройки
					</TooltipContent>
				</Tooltip>
			</nav>
		</aside>
	)
}
