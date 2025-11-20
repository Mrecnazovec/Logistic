'use client'

import { formatPriceValue } from '@/components/card/cardFormatters'
import { Badge } from '@/components/ui/Badge'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import type { IOrderList } from '@/shared/types/Order.interface'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { getOrderStatusLabel, getOrderStatusVariant } from '../orderStatusConfig'

const formatDateValue = (value?: string | null) => {
	if (!value) return '—'
	try {
		return format(new Date(value), 'dd.MM.yyyy', { locale: ru })
	} catch {
		return '—'
	}
}

const formatRouteDistance = (value?: string | null) => {
	if (!value) return '—'
	const numeric = Number(value)
	if (Number.isNaN(numeric)) return value
	return `${numeric.toLocaleString('ru-RU')} км`
}

const parseRouteDistance = (value?: string | null) => {
	const numeric = Number(value)
	return Number.isNaN(numeric) ? 0 : numeric
}

const parseDateValue = (value?: string | null) => {
	if (!value) return 0
	const timestamp = Date.parse(value)
	return Number.isNaN(timestamp) ? 0 : timestamp
}

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
				Погрузка
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => (
			<div className='flex flex-col'>
				<span>{row.original.origin_city || '—'}</span>
				<span className='text-muted-foreground text-sm'>{formatDateValue(row.original.load_date)}</span>
			</div>
		),
		sortingFn: (a, b) => parseDateValue(a.original.load_date) - parseDateValue(b.original.load_date),
	},
	{
		id: 'destination',
		header: ({ column }) => (
			<Button
				variant='ghost'
				className='hover:bg-transparent p-0'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Разгрузка
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => (
			<div className='flex flex-col'>
				<span>{row.original.destination_city || '—'}</span>
				<span className='text-muted-foreground text-sm'>{formatDateValue(row.original.delivery_date)}</span>
			</div>
		),
		sortingFn: (a, b) => parseDateValue(a.original.delivery_date) - parseDateValue(b.original.delivery_date),
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
		cell: ({ row }) => formatRouteDistance(row.original.route_distance_km),
		sortingFn: (a, b) => parseRouteDistance(a.original.route_distance_km) - parseRouteDistance(b.original.route_distance_km),
	},
	{
		accessorKey: 'price_total',
		header: 'Стоимость',
		cell: ({ row }) => formatPriceValue(row.original.price_total, row.original.currency),
	},
	{
		accessorKey: 'documents_count',
		header: 'Документы',
		cell: ({ row }) => row.original.documents_count ?? 0,
	},
]
