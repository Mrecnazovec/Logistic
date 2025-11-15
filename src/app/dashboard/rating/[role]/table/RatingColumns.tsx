'use client'

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { IUserRating } from '@/shared/types/Rating.interface'
import { IRatingTableRow } from '@/shared/types/RatingTableRow.interface'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Star } from 'lucide-react'

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

export const ratingColumns: ColumnDef<IUserRating>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => <UuidCopy uuid={String(row.original.id)} />,
	},
	{
		accessorKey: 'carrier_name',
		header: ({ column }) => renderSortableHeader(column, 'Перевозчик'),
		cell: ({ row }) => row.original.rated_user,
	},
	{
		accessorKey: 'driver_name',
		header: ({ column }) => renderSortableHeader(column, 'Имя водителя'),
		cell: ({ row }) => row.original.rated_user,
	},
	{
		accessorKey: 'score',
		header: ({ column }) => renderSortableHeader(column, 'Рейтинг'),
		cell: ({ row }) => (
			<span className='flex items-center gap-2 font-medium'>
				<Star className='size-4 text-yellow-400 fill-yellow-400' />
				{row.original.score.toFixed(1)}
			</span>
		),
		sortingFn: (a, b) => a.original.score - b.original.score,
	},
	{
		accessorKey: 'login',
		header: ({ column }) => renderSortableHeader(column, 'Логин'),
		cell: ({ row }) => row.original.rated_user,
	},
	// {
	// 	accessorKey: 'registered_at',
	// 	header: ({ column }) => renderSortableHeader(column, 'Дата регистрации'),
	// 	cell: ({ row }) => {
	// 		const date = new Date(row.original.registered_at)
	// 		return format(date, 'dd.MM.yyyy', { locale: ru })
	// 	},
	// 	sortingFn: (a, b) => {
	// 		const dateA = new Date(a.original.registered_at).getTime()
	// 		const dateB = new Date(b.original.registered_at).getTime()
	// 		return dateA - dateB
	// 	},
	// },
	// {
	// 	accessorKey: 'orders_completed',
	// 	header: ({ column }) => renderSortableHeader(column, 'Выполнено заказов'),
	// 	cell: ({ row }) => row.original.orders_completed.toLocaleString(),
	// 	sortingFn: (a, b) => a.original.orders_completed - b.original.orders_completed,
	// },
]
