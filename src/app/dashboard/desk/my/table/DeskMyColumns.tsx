'use client'

import { DeskMyActions } from '@/components/ui/actions/DeskMyActions'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getStatusBadge } from '@/components/ui/selectors/BadgeSelector'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { formatCurrencyValue } from '@/lib/currency'
import { formatDateValue, formatPlace, parseDateToTimestamp } from '@/lib/formatters'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { IOfferShort } from '@/shared/types/Offer.interface'
import { ColumnDef } from '@tanstack/react-table'
import { Minus } from 'lucide-react'

export const deskMyColumns: ColumnDef<IOfferShort>[] = [
	{
		accessorKey: 'uuid',
		header: 'ID',
		cell: ({ row }) => <UuidCopy id={row.original.id} />,
	},
	{
		accessorKey: 'carrier_name',
		header: 'Перевозчик',
	},
	{
		accessorKey: 'carrier_rating',
		header: 'Рейтинг',
		cell: ({ row }) => row.original.carrier_rating ?? '—',
	},
	{
		accessorKey: 'status_display',
		header: 'Статус',
		cell: ({ row }) => {
			const { variant, label } = getStatusBadge(row.original.status_display)
			return <Badge variant={variant}>{label}</Badge>
		},
	},
	{
		accessorKey: 'price_pref',
		header: 'Предпочтение оплаты',
	},
	{
		id: 'origin',
		header: ({ column }) => (
			<Button
				variant='ghost'
				className='p-0 hover:bg-transparent'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Отправление / дата
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => {
			const { origin_city, origin_country, load_date } = row.original
			const formattedDate = formatDateValue(load_date, 'dd.MM.yyyy', '—')
			return (
				<div className='flex flex-col'>
					<span>{formatPlace(origin_city, origin_country, '—')}</span>
					<span className='text-sm text-muted-foreground'>{formattedDate}</span>
				</div>
			)
		},
		sortingFn: (a, b) => parseDateToTimestamp(a.original.load_date) - parseDateToTimestamp(b.original.load_date),
	},
	{
		id: 'destination',
		header: ({ column }) => (
			<Button
				variant='ghost'
				className='p-0 hover:bg-transparent'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Назначение / дата
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => {
			const { destination_city, destination_country, delivery_date } = row.original
			const formattedDate = formatDateValue(delivery_date, 'dd.MM.yyyy', '—')
			return (
				<div className='flex flex-col'>
					<span>{formatPlace(destination_city, destination_country, '—')}</span>
					<span className='text-sm text-muted-foreground'>{formattedDate}</span>
				</div>
			)
		},
		sortingFn: (a, b) => parseDateToTimestamp(a.original.delivery_date) - parseDateToTimestamp(b.original.delivery_date),
	},
	{
		accessorKey: 'transport_type',
		header: 'Транспорт',
		cell: ({ row }) => {
			const transportName = TransportSelect.find((t) => t.type === row.original.transport_type)?.symb ?? '—'
			return transportName
		},
	},
	{
		accessorKey: 'weight_t',
		header: 'Вес (т)',
		cell: ({ row }) => `${row.original.weight_t} т`,
	},
	{
		accessorKey: 'price_currency',
		header: 'Валюта',
	},
	{
		accessorKey: 'price_value',
		header: ({ column }) => (
			<Button
				variant='ghost'
				className='p-0 hover:bg-transparent'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Цена
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatCurrencyValue(row.original.price_value, row.original.price_currency),
		sortingFn: (a, b) => {
			const priceA = Number(a.original.price_value || 0)
			const priceB = Number(b.original.price_value || 0)
			return priceA - priceB
		},
	},
	{
		accessorKey: 'phone',
		header: 'Телефон',
		cell: ({ row }) => row.original.phone ?? <Minus className='size-5' />,
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) => row.original.email ?? <Minus className='size-5' />,
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }) => <DeskMyActions cargo={row.original} />,
		enableSorting: false,
		enableHiding: false,
	},
]
