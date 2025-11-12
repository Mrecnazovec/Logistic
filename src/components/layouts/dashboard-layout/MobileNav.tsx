'use client'

import { Button } from '@/components/ui/Button'
import { ScrollArea, ScrollBar } from '@/components/ui/ScrollArea'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navItems } from './NavItems'

export function MobileNav() {
	const pathname = usePathname()
	const filteredPathname = `${pathname}/`
	const items = navItems.flatMap((group) => group.items)

	return (
		<nav
			aria-label='Navigation'
			className='md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80'
		>
			<div className='relative'>
				<ScrollArea type='auto' className='w-full'>
					<div className='flex justify-center items-end gap-2 px-4 pb-1 pt-2'>
						{items.map((item) => {
							const Icon = item.icon
							const isActive = filteredPathname.startsWith(item.href)
							return (
								<Link
									key={item.href}
									href={item.href}
									aria-current={isActive ? 'page' : undefined}
									className={cn(
										'flex min-w-[72px] flex-col items-center gap-1 rounded-2xl px-2 text-[11px] font-medium text-muted-foreground transition-colors max-w-[72px]',
										isActive && 'text-brand',
									)}
								>
									<Button
										variant='ghost'
										size='icon'
										className={cn(
											'size-11 rounded-2xl border border-transparent bg-muted/40 text-muted-foreground shadow-sm',
											'hover:bg-muted hover:text-foreground',
											isActive && 'border-brand/40 bg-brand/10 text-brand ring-1 ring-brand/30',
										)}
									>
										<Icon className='size-5' />
									</Button>
									<span className='w-full text-center text-[11px] leading-tight truncate'>{item.label}</span>
									<span
										aria-hidden='true'
										className={cn(
											'mt-0.5 h-1 w-8 rounded-full bg-transparent transition-colors',
											isActive && 'bg-brand',
										)}
									/>
								</Link>
							)
						})}
					</div>
					<ScrollBar orientation='horizontal' className='h-1.5 px-6' />
				</ScrollArea>
				<div className='pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background via-background/80 to-transparent' />
				<div className='pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background via-background/80 to-transparent' />
			</div>
		</nav>
	)
}

