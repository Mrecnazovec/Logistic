'use client'

import { type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type CardSectionItem = {
	icon: LucideIcon
	primary: ReactNode
	secondary?: ReactNode
}

export type CardSection = {
	title: string
	items: CardSectionItem[]
}

type CardSectionsProps = {
	sections: CardSection[]
}

export function CardSections({ sections }: CardSectionsProps) {
	if (!sections.length) {
		return null
	}

	return sections.map((section) => (
		<section key={section.title} className='flex flex-col gap-2'>
			<span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{section.title}</span>
			<div className='flex flex-wrap gap-2'>
				{section.items.map((item, index) => (
					<div
						key={`${section.title}-${index}`}
						className='flex min-w-[160px] flex-1 items-center gap-2 rounded-full bg-card px-4 py-2'
					>
						<item.icon className='size-4 text-muted-foreground' aria-hidden />
						<div className='flex flex-col leading-tight'>
							<span className='font-medium text-foreground'>{item.primary}</span>
							{item.secondary ? (
								<span className='text-xs text-muted-foreground'>{item.secondary}</span>
							) : null}
						</div>
					</div>
				))}
			</div>
		</section>
	))
}
