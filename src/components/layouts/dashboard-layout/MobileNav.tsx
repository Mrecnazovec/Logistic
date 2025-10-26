'use client'

import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "./NavItems"
import { Fragment } from "react"

export function MobileNav() {
	const pathname = usePathname()
	const filteredPathname = `${pathname}/`

	return <nav className="md:hidden flex items-center justify-between w-full bg-background fixed bottom-0 pb-9 z-50">
		{navItems.map((group, idx) => (
			<Fragment key={idx}>
				{group.items.map((item, i) => {
					const Icon = item.icon
					const isActive = filteredPathname.startsWith(item.href)
					return (
						<Link key={i} href={item.href} className={cn("flex flex-col items-center justify-center px-2 text-neutral-400 text-xs", isActive && 'text-brand')}>
							<Button
								variant='ghost'
								className={cn(
									'w-[70%] justify-center text-neutral-400 px-6 lg:text-base text-sm',
									'hover:bg-neutral-400/10 hover:text-neutral-400',
								)}
							>
								<Icon className={cn('size-5', isActive && 'text-brand')} />
							</Button>
							<p className="text-center">{item.label}</p>
						</Link>
					)
				})}
			</Fragment>
		))}
	</nav>
}
