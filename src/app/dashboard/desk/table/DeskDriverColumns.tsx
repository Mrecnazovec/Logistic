'use client'

import { CargoActionsDropdown } from '@/components/ui/actions/CargoActionsDropdown'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { DeskOffersModal } from '@/components/ui/modals/DeskOffersModal'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { IOfferShort } from '@/shared/types/Offer.interface'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
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
			<Button
				variant='ghost'
				className='hover:bg-transparent p-0'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Опубл. время
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => {
			const createdAt = new Date(row.original.created_at)
			const now = new Date()
			const diffMs = now.getTime() - createdAt.getTime()

			const minutes = Math.floor(diffMs / (1000 * 60))
			const hours = Math.floor(diffMs / (1000 * 60 * 60))
			const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

			if (days >= 1) return `${days} дн. назад`
			if (hours >= 1) return `${hours} ч. назад`
			return `${minutes} мин. назад`
		},
		sortingFn: (a, b) => {
			const dateA = new Date(a.original.created_at).getTime()
			const dateB = new Date(b.original.created_at).getTime()
			return dateA - dateB
		},
	},
	{
		accessorKey: 'price_value',
		header: ({ column }) => (
			<Button
				variant='ghost'
				className='hover:bg-transparent p-0'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Цена
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => Number(row.original.price_value || 0).toLocaleString(),
		sortingFn: (a, b) => {
			const priceA = Number(a.original.price_value || 0)
			const priceB = Number(b.original.price_value || 0)
			return priceA - priceB
		},
	},
	{
		accessorKey: 'price_currency',
		header: 'Валюта',
	},
	// {
	// 	accessorKey: 'route_km',
	// 	header: ({ column }) => (
	// 		<Button
	// 			variant='ghost'
	// 			className='hover:bg-transparent p-0'
	// 			onClick={(event) => cycleColumnSort(event, column)}
	// 		>
	// 			Путь (км)
	// 			<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
	// 		</Button>
	// 	),
	// 	cell: ({ row }) => `${row.original.route_km} км`,
	// },
	{
		accessorKey: 'weight_t',
		header: 'Вес (т)',
		cell: ({ row }) => `${row.original.weight_t} т`

	},
	{
		accessorKey: 'origin_city',
		header: 'Погрузка',
		cell: ({ row }) =>
			`${row.original.origin_city}, ${row.original.origin_country}`,
	},
	{
		accessorKey: 'destination_city',
		header: 'Выгрузка',
		cell: ({ row }) =>
			`${row.original.destination_city}, ${row.original.destination_country}`,
	},
	{
		accessorKey: 'load_date',
		header: ({ column }) => (
			<Button
				variant='ghost'
				className='hover:bg-transparent'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Дата
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => {
			const date = new Date(row.original.load_date)
			return format(date, 'dd/MM/yyyy', { locale: ru })
		},
		sortingFn: (a, b) => {
			const dateA = new Date(a.original.load_date).getTime()
			const dateB = new Date(b.original.load_date).getTime()
			return dateA - dateB
		},
	},
	{
		accessorKey: 'transport_type',
		header: 'Тип',
		cell: ({ row }) => {
			const transportName =
				TransportSelect.find((t) => t.type === row.original.transport_type)
					?.symb ?? '—'
			return transportName
		},
	},
	// {
	// 	accessorKey: 'has_offers',
	// 	header: 'Предложения',
	// 	cell: ({ row }) => <DeskOffersCell cargo={row.original} />,
	// },

	// {
	// 	id: 'actions',
	// 	header: '',
	// 	cell: ({ row }) => <CargoActionsDropdown cargo={row.original} />,
	// 	enableSorting: false,
	// 	enableHiding: false,
	// },
]

function DeskOffersCell({ cargo }: { cargo: ICargoList }) {
	const [open, setOpen] = useState(false)
	const hasOffers = Boolean(cargo.has_offers)

	return (
		<>
			<div className='flex items-center gap-2'>


				<Button
					type='button'
					variant='link'
					className='px-0 h-auto font-medium disabled:text-muted-foreground'
					onClick={() => setOpen(true)}
					disabled={!hasOffers}
				>
					{hasOffers ? (
						<CircleCheck className='size-5 text-success-400' />
					) : (
						<Minus className='size-5 text-neutral-400' />
					)}
				</Button>
			</div>

			<DeskOffersModal selectedRow={cargo} open={open} onOpenChange={setOpen} />
		</>
	)
}


