"use client"

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { DeskOffersModal } from '@/components/ui/modals/DeskOffersModal'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { formatCurrencyValue } from '@/lib/currency'
import { formatDateValue, formatDistanceKm, formatRelativeDate, formatWeightValue } from '@/lib/formatters'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { IOfferShort } from '@/shared/types/Offer.interface'
import { ColumnDef } from '@tanstack/react-table'
import { CircleCheck, Minus } from 'lucide-react'
import { useState } from 'react'

export const deskDriverColumns: ColumnDef<IOfferShort>[] = [
	{
		accessorKey: 'uuid',
		header: 'ID',
		cell: ({ row }) => <UuidCopy id={row.original.id} />,
	},
	{
		accessorKey: 'created_at',
		header: ({ column }) => (
			<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				Опубл. время
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatRelativeDate(row.original.created_at, '—'),
		sortingFn: (a, b) => new Date(a.original.created_at).getTime() - new Date(b.original.created_at).getTime(),
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
		accessorKey: 'price_currency',
		header: 'Валюта',
	},
	{
		accessorKey: 'route_km',
		header: ({ column }) => (
			<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				Путь (км)
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatDistanceKm(row.original.route_km),
	},
	{
		accessorKey: 'weight_t',
		header: 'Вес (т)',
		cell: ({ row }) => formatWeightValue(row.original.weight_t),
	},
	{
		accessorKey: 'origin_city',
		header: 'Погрузка',
		cell: ({ row }) => `${row.original.origin_city}, ${row.original.origin_country}`,
	},
	{
		accessorKey: 'destination_city',
		header: 'Выгрузка',
		cell: ({ row }) => `${row.original.destination_city}, ${row.original.destination_country}`,
	},
	{
		accessorKey: 'load_date',
		header: ({ column }) => (
			<Button variant='ghost' className='hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
				Дата
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => formatDateValue(row.original.load_date, 'dd/MM/yyyy', '—'),
		sortingFn: (a, b) => new Date(a.original.load_date).getTime() - new Date(b.original.load_date).getTime(),
	},
	{
		accessorKey: 'transport_type',
		header: 'Тип',
		cell: ({ row }) => TransportSelect.find((t) => t.type === row.original.transport_type)?.symb ?? '—',
	},
	{
		accessorKey: 'accepted_by_carrier',
		header: 'Предложения',
		cell: ({ row }) => <DeskOffersCell cargo={row.original} />,
	},
]

function DeskOffersCell({ cargo }: { cargo: IOfferShort }) {
	const [open, setOpen] = useState(false)
	const hasOffers = Boolean(cargo.accepted_by_carrier)

	return (
		<>
			<Button
				type='button'
				variant='link'
				className='h-auto px-0 font-medium disabled:text-muted-foreground'
				onClick={() => setOpen(true)}
				disabled={!hasOffers}
			>
				{hasOffers ? <CircleCheck className='size-5 text-success-400' /> : <Minus className='size-5 text-neutral-400' />}
			</Button>

			<DeskOffersModal cargoUuid={cargo.cargo_uuid} open={open} onOpenChange={setOpen} />
		</>
	)
}
