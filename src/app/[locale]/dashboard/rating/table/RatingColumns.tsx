'use client'

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { IRatingUserList } from '@/shared/types/Rating.interface'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import { Minus, Star } from 'lucide-react'

type Translator = (key: string, params?: Record<string, string | number>) => string

const renderSortableHeader = (column: any, label: string) => (
	<Button
		variant='ghost'
		className='hover:bg-transparent p-0'
		onClick={(event) => cycleColumnSort(event, column)}
	>
		{label}
		<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
	</Button>
)

const toNumber = (value: number | string | null | undefined) => {
	if (value === null || value === undefined) return null
	const num = typeof value === 'string' ? Number(value) : value
	return Number.isFinite(num) ? num : null
}

export const getRatingColumns = (t: Translator, locale: string): ColumnDef<IRatingUserList>[] => {
	const numberLocale = locale === 'en' ? 'en-US' : 'ru-RU'
	const dateLocale = locale === 'en' ? enUS : ru

	return [
		{
			accessorKey: 'id',
			header: 'ID',
			cell: ({ row }) => <UuidCopy uuid={String(row.original.id)} />,
		},
		{
			accessorKey: 'company_name',
			header: ({ column }) => renderSortableHeader(column, t('rating.table.company')),
			cell: ({ row }) => row.original.company_name ?? '-',
		},
		{
			accessorKey: 'display_name',
			header: ({ column }) => renderSortableHeader(column, t('rating.table.person')),
			cell: ({ row }) => row.original.display_name ?? '-',
		},
		{
			accessorKey: 'country',
			header: ({ column }) => renderSortableHeader(column, t('rating.table.country')),
			cell: ({ row }) => row.original.country ?? '-',
		},
		{
			accessorKey: 'avg_rating',
			header: ({ column }) => renderSortableHeader(column, t('rating.table.rating')),
			cell: ({ row }) => {
				const value = toNumber(row.original.avg_rating)
				return (
					<span className='flex items-center gap-2 font-medium'>
						<Star className='size-4 text-warning-500 fill-warning-500' />
						{value !== null ? value.toFixed(1) : <Minus />}
					</span>
				)
			},
			sortingFn: (a, b) => (toNumber(a.original.avg_rating) ?? 0) - (toNumber(b.original.avg_rating) ?? 0),
		},
		{
			accessorKey: 'rating_count',
			header: ({ column }) => renderSortableHeader(column, t('rating.table.reviews')),
			cell: ({ row }) => {
				const value = toNumber(row.original.rating_count)
				return value !== null ? value.toLocaleString(numberLocale) : '-'
			},
			sortingFn: (a, b) => (toNumber(a.original.rating_count) ?? 0) - (toNumber(b.original.rating_count) ?? 0),
		},
		{
			accessorKey: 'completed_orders',
			header: ({ column }) => renderSortableHeader(column, t('rating.table.completed')),
			cell: ({ row }) => {
				const value = toNumber(row.original.completed_orders)
				return value !== null ? value.toLocaleString(numberLocale) : '-'
			},
			sortingFn: (a, b) => (toNumber(a.original.completed_orders) ?? 0) - (toNumber(b.original.completed_orders) ?? 0),
		},
		{
			accessorKey: 'registered_at',
			header: ({ column }) => renderSortableHeader(column, t('rating.table.registeredAt')),
			cell: ({ row }) => {
				const date = new Date(row.original.registered_at ?? '')
				return Number.isNaN(date.getTime()) ? '-' : format(date, 'dd.MM.yyyy', { locale: dateLocale })
			},
			sortingFn: (a, b) => {
				const dateA = new Date(a.original.registered_at ?? '').getTime()
				const dateB = new Date(b.original.registered_at ?? '').getTime()
				return dateA - dateB
			},
		},
	]
}
