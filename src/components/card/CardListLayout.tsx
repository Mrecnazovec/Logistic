'use client'

import { CardPaginationControls, type CardPaginationState } from '@/components/pagination/CardPagination'
import type { ReactNode } from 'react'

type CardListLayoutProps<TItem> = {
	items: TItem[]
	getKey: (item: TItem) => string | number
	renderItem: (item: TItem, index: number) => ReactNode
	pagination?: CardPaginationState
}

export function CardListLayout<TItem>({
	items,
	getKey,
	renderItem,
	pagination,
}: CardListLayoutProps<TItem>) {
	return (
		<div className='flex flex-1 flex-col gap-4'>
			<div className='flex-1 overflow-hidden rounded-4xl xs:bg-background xs:p-4'>
				<div className='grid h-full min-h-0 grid-cols-1 gap-4 overflow-y-auto pr-1 lg:grid-cols-3 sm:grid-cols-2'>
					{items.map((item, index) => (
						<div key={getKey(item)}>{renderItem(item, index)}</div>
					))}
				</div>
			</div>

			{pagination ? <CardPaginationControls pagination={pagination} /> : null}
		</div>
	)
}
