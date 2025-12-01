'use client'

import { Badge } from '@/components/ui/Badge'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import {
	formatDateValue,
	formatDistanceKm,
	formatPriceValue,
	parseDateToTimestamp,
	parseDistanceKm,
} from '@/lib/formatters'
import type { IOrderList } from '@/shared/types/Order.interface'
import { ColumnDef } from '@tanstack/react-table'
import { getOrderStatusLabel, getOrderStatusVariant } from '../orderStatusConfig'

export const historyColumns: ColumnDef<IOrderList>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => <UuidCopy id={row.original.id} />,
	},
	{
		accessorKey: 'customer_name',
		header: 'Заказчик',
		cell: ({ row }) => row.original.customer_name || '—',
	},
	{
		accessorKey: 'carrier_name',
		header: 'Перевозчик',
		cell: ({ row }) => row.original.carrier_name || '—',
	},
	{
		accessorKey: 'logistic_name',
		header: 'Логист',
		cell: ({ row }) => row.original.logistic_name || '—',
	},
	{
		accessorKey: 'status',
		header: 'Статус',
		cell: ({ row }) => (
			<Badge variant={getOrderStatusVariant(row.original.status)}>
				{getOrderStatusLabel(row.original.status)}
			</Badge>
		),
	},
	{
		id: 'origin',
		header: ({ column }) => (
			<Button
				variant='ghost'
				className='hover:bg-transparent p-0'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Отправление
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => (
			<div className='flex flex-col'>
				<span>{row.original.origin_city || '—'}</span>
				<span className='text-muted-foreground text-sm'>{formatDateValue(row.original.load_date)}</span>
			</div>
		),
		sortingFn: (a, b) => parseDateToTimestamp(a.original.load_date) - parseDateToTimestamp(b.original.load_date),
	},
	{
		id: 'destination',
		header: ({ column }) => (
			<Button
				variant='ghost'
				className='hover:bg-transparent p-0'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Назначение
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => (
			<div className='flex flex-col'>
				<span>{row.original.destination_city || '—'}</span>
				<span className='text-muted-foreground text-sm'>{formatDateValue(row.original.delivery_date)}</span>
			</div>
		),
		sortingFn: (a, b) => parseDateToTimestamp(a.original.delivery_date) - parseDateToTimestamp(b.original.delivery_date),
	},
	{
		id: 'route_distance_km',
		header: ({ column }) => (
			<Button
				variant='ghost'
				className='hover:bg-transparent p-0'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Расстояние (км)
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatDistanceKm(row.original.route_distance_km),
		sortingFn: (a, b) => parseDistanceKm(a.original.route_distance_km) - parseDistanceKm(b.original.route_distance_km),
	},
	{
		accessorKey: 'price_total',
		header: 'Стоимость',
		cell: ({ row }) => formatPriceValue(row.original.price_total, row.original.currency),
	},
	{
		accessorKey: 'documents_count',
		header: 'Документов',
		cell: ({ row }) => row.original.documents_count ?? 0,
	},
]
