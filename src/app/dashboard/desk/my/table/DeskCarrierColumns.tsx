'use client'

import { DeskMyActions } from '@/components/ui/actions/DeskMyActions'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { IOfferShort } from '@/shared/types/Offer.interface'
import { formatCurrencyValue } from '@/shared/utils/currency'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Minus } from 'lucide-react'

const getStatusBadge = (status?: string) => {
	const normalized = (status || '').toLowerCase()
	if (normalized.includes('ожидает')) return { variant: 'warning' as const, label: status }
	if (normalized.includes('ответ')) return { variant: 'success' as const, label: status }
	if (normalized.includes('отмен')) return { variant: 'danger' as const, label: status }
	return { variant: 'secondary' as const, label: status || '—' }
}

export const deskCarrierColumns: ColumnDef<IOfferShort>[] = [
	{
		accessorKey: 'uuid',
		header: 'ID',
		cell: ({ row }) => <UuidCopy id={row.original.id} />,
	},
	{
		accessorKey: 'company_name',
		header: 'Компания',
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
		id: 'origin',
		header: ({ column }) => (
			<Button
				variant='ghost'
				className='p-0 hover:bg-transparent'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Погрузка / дата
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => {
			const { origin_city, origin_country, load_date } = row.original
			const formattedDate = load_date ? format(new Date(load_date), 'dd.MM.yyyy', { locale: ru }) : '—'
			return (
				<div className='flex flex-col'>
					<span>{`${origin_city}, ${origin_country}`}</span>
					<span className='text-sm text-muted-foreground'>{formattedDate}</span>
				</div>
			)
		},
		sortingFn: (a, b) => {
			const dateA = new Date(a.original.load_date).getTime()
			const dateB = new Date(b.original.load_date).getTime()
			return dateA - dateB
		},
	},
	{
		id: 'destination',
		header: ({ column }) => (
			<Button
				variant='ghost'
				className='p-0 hover:bg-transparent'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Выгрузка / дата
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => {
			const { destination_city, destination_country, delivery_date } = row.original
			const formattedDate =
				delivery_date && typeof delivery_date === 'string'
					? format(new Date(delivery_date), 'dd.MM.yyyy', { locale: ru })
					: '—'
			return (
				<div className='flex flex-col'>
					<span>{`${destination_city}, ${destination_country}`}</span>
					<span className='text-sm text-muted-foreground'>{formattedDate}</span>
				</div>
			)
		},
		sortingFn: (a, b) => {
			const parse = (value?: string | null) => (value ? new Date(value).getTime() : 0)
			return parse(a.original.delivery_date) - parse(b.original.delivery_date)
		},
	},
	{
		accessorKey: 'transport_type',
		header: 'Тип',
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
				Ставка
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
