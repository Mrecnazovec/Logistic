'use client'

import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import {
	formatDateValue,
	formatDistanceKm,
	formatPriceValue,
	formatRelativeDate,
	formatWeightValue,
	parseDateToTimestamp,
} from '@/lib/formatters'
import { getTransportSymbol, type TransportTypeEnum } from '@/shared/enums/TransportType.enum'
import type { ICargoList } from '@/shared/types/CargoList.interface'
import type { ColumnDef } from '@tanstack/react-table'
import { Minus } from 'lucide-react'

type Translator = (key: string) => string

export const getCargoColumns = (t: Translator): ColumnDef<ICargoList>[] => [
	{
		accessorKey: 'created_at',
		header: ({ column }) => (
			<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				{t('announcements.table.published')}
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatRelativeDate(row.original.created_at, '-'),
		sortingFn: (a, b) => parseDateToTimestamp(a.original.created_at) - parseDateToTimestamp(b.original.created_at),
	},
	{
		accessorKey: 'price_value',
		header: ({ column }) => (
			<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				{t('announcements.table.price')}
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatPriceValue(row.original.price_value, row.original.price_currency),
		sortingFn: (a, b) => {
			const priceA = Number(a.original.price_uzs || 0)
			const priceB = Number(b.original.price_uzs || 0)
			return priceA - priceB
		},
	},
	{
		accessorKey: 'price_currency',
		header: t('announcements.table.currency'),
	},
	{
		accessorKey: 'route_km',
		header: ({ column }) => (
			<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				{t('announcements.table.distance')}
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatDistanceKm(row.original.route_km),
		sortingFn: (a, b) => Number(a.original.route_km || 0) - Number(b.original.route_km || 0),
	},
	{
		accessorKey: 'weight_t',
		header: t('announcements.table.weight'),
		cell: ({ row }) => formatWeightValue(row.original.weight_t),
	},
	{
		accessorKey: 'origin_city',
		header: t('announcements.table.origin'),
		cell: ({ row }) => `${row.original.origin_city}, ${row.original.origin_country}`,
	},
	{
		accessorKey: 'origin_radius_km',
		header: t('announcements.table.originRadius'),
	},
	{
		accessorKey: 'destination_city',
		header: t('announcements.table.destination'),
		cell: ({ row }) => `${row.original.destination_city}, ${row.original.destination_country}`,
	},
	{
		accessorKey: 'dest_radius_km',
		header: t('announcements.table.destinationRadius'),
	},
	{
		accessorKey: 'load_date',
		header: ({ column }) => (
			<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				{t('announcements.table.loadDate')}
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatDateValue(row.original.load_date, 'dd/MM/yyyy', '-'),
		sortingFn: (a, b) => parseDateToTimestamp(a.original.load_date) - parseDateToTimestamp(b.original.load_date),
	},
	{
		accessorKey: 'transport_type',
		header: t('announcements.table.transport'),
		cell: ({ row }) => getTransportSymbol(t, row.original.transport_type as TransportTypeEnum) || '-',
	},
	{
		accessorKey: 'company_name',
		header: t('announcements.table.company'),
	},
	{
		accessorKey: 'phone',
		header: t('announcements.table.phone'),
		cell: ({ row }) => {
			if (row.original.contact_pref === 'phone' || row.original.contact_pref === 'both') return row.original.phone
			return <Minus className='size-5' />
		},
	},
	{
		accessorKey: 'email',
		header: t('announcements.table.email'),
		cell: ({ row }) => {
			if (row.original.contact_pref === 'email' || row.original.contact_pref === 'both') return row.original.email
			return <Minus className='size-5' />
		},
	},
]
