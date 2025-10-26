'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip'
import { Logo } from '@/components/ui/Logo'
import { usePathname } from 'next/navigation'
import { navItems } from './NavItems'



export function Sidebar() {
	const pathname = usePathname()
	const filteredPathname = `${pathname}/`

	return (
		<aside className='w-[9vw] max-w-32 pt-8 bg-brand-900 text-white md:flex hidden flex-col rounded-tr-[42px] rounded-br-xl flex-shrink-0'>
			<Logo />
			<nav className='flex-1 flex flex-col items-center gap-2 mt-8'>
				{navItems.map((group, idx) => (
					<div key={idx} className='w-full flex flex-col items-center gap-2'>
						{group.group && <p className='font-medium text-[10px] uppercase'>{group.group}</p>}
						{group.items.map((item, i) => {
							const Icon = item.icon
							const isActive = filteredPathname.startsWith(item.href)
							return (
								<Tooltip key={i}>
									<TooltipTrigger asChild>
										<Link className='w-full flex justify-center' href={item.href}>
											<Button
												variant='ghost'
												className={cn(
													'w-[70%] justify-center text-white px-6 lg:text-base text-sm',
													'hover:bg-white/10 hover:text-white',
													isActive && 'bg-white/20'
												)}
											>
												<Icon className='size-5' />
											</Button>
										</Link>
									</TooltipTrigger>
									<TooltipContent side='bottom' sideOffset={8}>
										{item.label}
									</TooltipContent>
								</Tooltip>
							)
						})}
					</div>
				))}
			</nav>
		</aside>
	)
}
