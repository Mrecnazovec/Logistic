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

type Translator = (key: string, params?: Record<string, string | number>) => string

export const getHistoryColumns = (t: Translator): ColumnDef<IOrderList>[] => [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => <UuidCopy id={row.original.id} />,
	},
	{
		accessorKey: 'customer_name',
		header: t('history.table.customer'),
		cell: ({ row }) => row.original.customer_name || t('history.placeholder'),
	},
	{
		accessorKey: 'carrier_name',
		header: t('history.table.carrier'),
		cell: ({ row }) => row.original.carrier_name || t('history.placeholder'),
	},
	{
		accessorKey: 'logistic_name',
		header: t('history.table.logistic'),
		cell: ({ row }) => row.original.logistic_name || t('history.placeholder'),
	},
	{
		accessorKey: 'status',
		header: t('history.table.status'),
		cell: ({ row }) => (
			<Badge variant={getOrderStatusVariant(row.original.status)}>
				{getOrderStatusLabel(row.original.status, t)}
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
				{t('history.table.origin')}
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => (
			<div className='flex flex-col'>
				<span>{row.original.origin_city || t('history.placeholder')}</span>
				<span className='text-muted-foreground text-sm'>
					{formatDateValue(row.original.load_date)}
				</span>
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
				{t('history.table.destination')}
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => (
			<div className='flex flex-col'>
				<span>{row.original.destination_city || t('history.placeholder')}</span>
				<span className='text-muted-foreground text-sm'>
					{formatDateValue(row.original.delivery_date)}
				</span>
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
				{t('history.table.route')}
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatDistanceKm(row.original.route_distance_km),
		sortingFn: (a, b) => parseDistanceKm(a.original.route_distance_km) - parseDistanceKm(b.original.route_distance_km),
	},
	{
		accessorKey: 'price_total',
		header: t('history.table.price'),
		cell: ({ row }) => formatPriceValue(row.original.price_total, row.original.currency),
	},
	{
		accessorKey: 'documents_count',
		header: t('history.table.documents'),
		cell: ({ row }) => {
			const count = row.original.documents_count ?? 0
			const className = count === 0
				? 'rounded-full bg-[#F8F9FC] border border-[#D5D9EB] size-7 flex items-center justify-center'
				: 'rounded-full bg-[#F4F3FF] border border-[#D9D6FE] size-7 flex items-center justify-center'
			return <div className={className}>{count}</div>
		},
	},
]
