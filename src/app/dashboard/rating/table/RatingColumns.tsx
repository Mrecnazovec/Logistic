'use client'

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { IRatingUserList } from '@/shared/types/Rating.interface'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Minus, Star } from 'lucide-react'

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

export const ratingColumns: ColumnDef<IRatingUserList>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => <UuidCopy uuid={String(row.original.id)} />,
	},
	{
		accessorKey: 'company_name',
		header: ({ column }) => renderSortableHeader(column, 'Компания'),
		cell: ({ row }) => row.original.company_name ?? '-',
	},
	{
		accessorKey: 'display_name',
		header: ({ column }) => renderSortableHeader(column, 'Имя'),
		cell: ({ row }) => row.original.display_name ?? '-',
	},
	{
		accessorKey: 'avg_rating',
		header: ({ column }) => renderSortableHeader(column, 'Рейтинг'),
		cell: ({ row }) => (
			<span className='flex items-center gap-2 font-medium'>
				<Star className='size-4 text-yellow-400 fill-yellow-400' />
				{row.original.avg_rating ? row.original.avg_rating.toFixed(1) : <Minus />}
			</span>
		),
		sortingFn: (a, b) => a.original.avg_rating - b.original.avg_rating,
	},
	{
		accessorKey: 'rating_count',
		header: ({ column }) => renderSortableHeader(column, 'Отзывов'),
		cell: ({ row }) => row.original.rating_count.toLocaleString('ru-RU'),
		sortingFn: (a, b) => a.original.rating_count - b.original.rating_count,
	},
	{
		accessorKey: 'completed_orders',
		header: ({ column }) => renderSortableHeader(column, 'Выполненных заказов'),
		cell: ({ row }) => row.original.completed_orders.toLocaleString('ru-RU'),
		sortingFn: (a, b) => a.original.completed_orders - b.original.completed_orders,
	},
	{
		accessorKey: 'registered_at',
		header: ({ column }) => renderSortableHeader(column, 'Зарегистрирован с'),
		cell: ({ row }) => {
			const date = new Date(row.original.registered_at)
			return Number.isNaN(date.getTime()) ? '-' : format(date, 'dd.MM.yyyy', { locale: ru })
		},
		sortingFn: (a, b) => {
			const dateA = new Date(a.original.registered_at).getTime()
			const dateB = new Date(b.original.registered_at).getTime()
			return dateA - dateB
		},
	},
]
