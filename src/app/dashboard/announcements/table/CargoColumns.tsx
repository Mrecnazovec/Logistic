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
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { ColumnDef } from '@tanstack/react-table'
import { Minus } from 'lucide-react'

export const cargoColumns: ColumnDef<ICargoList>[] = [
	{
		accessorKey: 'created_at',
		header: ({ column }) => (
			<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				Опубликован
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatRelativeDate(row.original.created_at, '—'),
		sortingFn: (a, b) => parseDateToTimestamp(a.original.created_at) - parseDateToTimestamp(b.original.created_at),
	},
	{
		accessorKey: 'price_value',
		header: ({ column }) => (
			<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				Цена
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
		header: 'Валюта',
	},
	{
		accessorKey: 'route_km',
		header: ({ column }) => (
			<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				Дистанция (км)
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatDistanceKm(row.original.route_km),
		sortingFn: (a, b) => Number(a.original.route_km || 0) - Number(b.original.route_km || 0),
	},
	{
		accessorKey: 'weight_t',
		header: 'Вес (т)',
		cell: ({ row }) => formatWeightValue(row.original.weight_t),
	},
	{
		accessorKey: 'origin_city',
		header: 'Отправление',
		cell: ({ row }) => `${row.original.origin_city}, ${row.original.origin_country}`,
	},
	{
		accessorKey: 'origin_radius_km',
		header: 'Радиус',
	},
	{
		accessorKey: 'destination_city',
		header: 'Назначение',
		cell: ({ row }) => `${row.original.destination_city}, ${row.original.destination_country}`,
	},
	{
		accessorKey: 'dest_radius_km',
		header: 'Радиус',
	},
	{
		accessorKey: 'load_date',
		header: ({ column }) => (
			<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				Дата загрузки
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatDateValue(row.original.load_date, 'dd/MM/yyyy', '—'),
		sortingFn: (a, b) => parseDateToTimestamp(a.original.load_date) - parseDateToTimestamp(b.original.load_date),
	},
	{
		accessorKey: 'transport_type',
		header: 'Транспорт',
		cell: ({ row }) => TransportSelect.find((t) => t.type === row.original.transport_type)?.symb ?? '—',
	},
	{
		accessorKey: 'company_name',
		header: 'Компания',
	},
	{
		accessorKey: 'phone',
		header: 'Телефон',
		cell: ({ row }) => {
			if (row.original.contact_pref === 'phone' || row.original.contact_pref === 'both') return row.original.phone
			return <Minus className='size-5' />
		},
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) => {
			if (row.original.contact_pref === 'email' || row.original.contact_pref === 'both') return row.original.email
			return <Minus className='size-5' />
		},
	},
]
