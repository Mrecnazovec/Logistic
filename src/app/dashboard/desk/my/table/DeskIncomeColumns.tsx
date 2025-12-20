"use client"

import { DeskMyActions } from '@/components/ui/actions/DeskMyActions'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getOfferStatusMeta } from '@/components/ui/selectors/BadgeSelector'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { formatCurrencyValue } from '@/lib/currency'
import { formatDateValue, formatPlace, parseDateToTimestamp } from '@/lib/formatters'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { IOfferShort } from '@/shared/types/Offer.interface'
import { useRoleStore } from '@/store/useRoleStore'
import { ColumnDef } from '@tanstack/react-table'
import { Minus } from 'lucide-react'

export const deskIncomeColumns: ColumnDef<IOfferShort>[] = [
	{
		accessorKey: 'uuid',
		header: 'ID',
		cell: ({ row }) => <UuidCopy uuid={row.original.cargo_uuid} />,
	},
	{
		accessorKey: 'customer_company',
		header: 'Компания',
	},
	{
		accessorKey: 'status_display',
		header: 'Статус',
		cell: ({ row }) => {
			const role = useRoleStore.getState().role
			const { variant, label, highlight } = getOfferStatusMeta(row.original, role)
			return <Badge variant={variant} className={highlight ? 'animate-pulse' : undefined}>{label}</Badge>
		},
	},
	{
		id: 'origin',
		header: ({ column }) => (
			<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				Отправление / дата
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => {
			const { origin_city, origin_country, load_date } = row.original
			return (
				<div className='flex flex-col'>
					<span>{formatPlace(origin_city, origin_country, '—')}</span>
					<span className='text-sm text-muted-foreground'>{formatDateValue(load_date, 'dd.MM.yyyy', '—')}</span>
				</div>
			)
		},
		sortingFn: (a, b) => parseDateToTimestamp(a.original.load_date) - parseDateToTimestamp(b.original.load_date),
	},
	{
		id: 'destination',
		header: ({ column }) => (
			<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				Назначение / дата
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => {
			const { destination_city, destination_country, delivery_date } = row.original
			return (
				<div className='flex flex-col'>
					<span>{formatPlace(destination_city, destination_country, '—')}</span>
					<span className='text-sm text-muted-foreground'>{formatDateValue(delivery_date, 'dd.MM.yyyy', '—')}</span>
				</div>
			)
		},
		sortingFn: (a, b) => parseDateToTimestamp(a.original.delivery_date) - parseDateToTimestamp(b.original.delivery_date),
	},
	{
		accessorKey: 'transport_type',
		header: 'Транспорт',
		cell: ({ row }) => TransportSelect.find((t) => t.type === row.original.transport_type)?.symb ?? '—',
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
			<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				Цена
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatCurrencyValue(row.original.price_value, row.original.price_currency),
		sortingFn: (a, b) => Number(a.original.price_value || 0) - Number(b.original.price_value || 0),
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
