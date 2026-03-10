"use client"

import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { formatCurrencyValue } from '@/lib/currency'
import { formatDateValue, formatDistanceKm, formatRelativeDate, formatWeightValue } from '@/lib/formatters'
import type { Locale } from '@/i18n/config'
import { getTransportSymbol, type TransportTypeEnum } from '@/shared/enums/TransportType.enum'
import type { IOfferShort } from '@/shared/types/Offer.interface'
import type { ColumnDef } from '@tanstack/react-table'

type Translator = (key: string) => string

export const getDeskDriverColumns = (t: Translator, locale: Locale): ColumnDef<IOfferShort>[] => [
	{
		accessorKey: 'created_at',
		header: ({ column }) => (
			<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				{t('desk.driver.table.published')}
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatRelativeDate(row.original.created_at, '-', locale),
		sortingFn: (a, b) => new Date(a.original.created_at).getTime() - new Date(b.original.created_at).getTime(),
	},
	{
		accessorKey: 'price_value',
		header: ({ column }) => (
			<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				{t('desk.driver.table.price')}
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatCurrencyValue(row.original.price_value, row.original.price_currency),
		// sortingFn: (a, b) => Number(a.original.price_uzs || 0) - Number(b.original.price_uzs || 0),
	},
	{
		accessorKey: 'price_currency',
		header: t('desk.driver.table.currency'),
	},
	{
		accessorKey: 'route_km',
		header: ({ column }) => (
			<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				{t('desk.driver.table.distance')}
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatDistanceKm(row.original.route_km),
	},
	{
		accessorKey: 'weight_t',
		header: t('desk.driver.table.weight'),
		cell: ({ row }) => formatWeightValue(row.original.weight_t),
	},
	{
		accessorKey: 'origin_city',
		header: t('desk.driver.table.load'),
		cell: ({ row }) => `${row.original.origin_city}, ${row.original.origin_country}`,
	},
	{
		accessorKey: 'destination_city',
		header: t('desk.driver.table.unload'),
		cell: ({ row }) => `${row.original.destination_city}, ${row.original.destination_country}`,
	},
	{
		accessorKey: 'load_date',
		header: ({ column }) => (
			<Button variant='ghost' className='hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				{t('desk.driver.table.date')}
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatDateValue(row.original.load_date, 'dd/MM/yyyy', '-'),
		sortingFn: (a, b) => new Date(a.original.load_date).getTime() - new Date(b.original.load_date).getTime(),
	},
	{
		accessorKey: 'transport_type',
		header: t('desk.driver.table.type'),
		cell: ({ row }) => getTransportSymbol(t, row.original.transport_type as TransportTypeEnum) || '-',
	},
	{
		accessorKey: 'offers_count',
		header: t('desk.driver.table.offers'),
	},
]
