'use client'

import { CargoActionsDropdown } from '@/components/ui/actions/CargoActionsDropdown'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { BadgeSelector } from '@/components/ui/selectors/BadgeSelector'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { StatusEnum } from '@/shared/enums/Status.enum'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Check, Handshake, X } from 'lucide-react'

export const deskMyColumns: ColumnDef<ICargoList>[] = [

	{
		id: 'fast_actions',
		header: 'Быстрые действия',
		cell: ({ row }) => {
			const cargo = row.original

			const handleAccept = () => console.log('✅ Принять', cargo)
			const handleOffer = () => console.log('🤝 Предложить', cargo)
			const handleReject = () => console.log('❌ Отменить', cargo)

			return (
				<div className='flex items-center gap-3'>
					<Button
						variant='outline'
						size='icon'
						onClick={handleAccept}
						className='rounded-full bg-green-50 hover:bg-green-100 border-none text-green-600'
					>
						<Check className='size-4' />
					</Button>

					<Button
						variant='outline'
						size='icon'
						onClick={handleOffer}
						className='rounded-full bg-yellow-50 hover:bg-yellow-100 border-none text-yellow-700'
					>
						<Handshake className='size-4' />
					</Button>

					<Button
						variant='outline'
						size='icon'
						onClick={handleReject}
						className='rounded-full bg-red-50 hover:bg-red-100 border-none text-red-600'
					>
						<X className='size-4' />
					</Button>
				</div>
			)
		},
	},
	{
		accessorKey: 'uuid',
		header: 'ID',
		cell: ({ row }) => <UuidCopy uuid={row.original.uuid} />,
	},
	{
		accessorKey: 'company_name',
		header: 'Перевозчик',
	},
	{
		accessorKey: 'status',
		header: 'Статус',
		cell: ({ row }) => {
			const status = row.original.status as StatusEnum

			return (
				<BadgeSelector status={status} />
			)

		},
	},
	{
		id: 'origin',
		header: ({ column }) => (
			<Button
				variant='ghost'
				className='hover:bg-transparent p-0'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Откуда / Дата погрузки
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => {
			const { origin_city, origin_country, load_date } = row.original
			const formattedDate = load_date
				? format(new Date(load_date), 'dd.MM.yyyy', { locale: ru })
				: '—'
			return (
				<div className='flex flex-col'>
					<span>{`${origin_city}, ${origin_country}`}</span>
					<span className='text-muted-foreground text-sm'>{formattedDate}</span>
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
				className='hover:bg-transparent p-0'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Куда / Дата разгрузки
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
					<span className='text-muted-foreground text-sm'>{formattedDate}</span>
				</div>
			)
		},
		sortingFn: (a, b) => {
			const dateA = a.original.delivery_date
				? new Date(a.original.delivery_date).getTime()
				: 0
			const dateB = b.original.delivery_date
				? new Date(b.original.delivery_date).getTime()
				: 0
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
	{
		accessorKey: 'weight_t',
		header: 'Вес (т)',
		cell: ({row}) => `${row.original.weight_t} т`

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
				className='hover:bg-transparent p-0'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Цена
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => Number(row.original.price_value || 0).toLocaleString(),
		sortingFn: (a, b) => {
			const priceA = Number(a.original.price_uzs || 0)
			const priceB = Number(b.original.price_uzs || 0)
			return priceA - priceB
		},
	},
	{
		accessorKey: 'contact_value',
		header: 'Контакты',
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }) => <CargoActionsDropdown cargo={row.original} isOffer />,
		enableSorting: false,
		enableHiding: false,
	},
]
