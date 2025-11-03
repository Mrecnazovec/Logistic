'use client'

import { CargoActionsDropdown } from '@/components/ui/actions/CargoActionsDropdown'
import { Button } from '@/components/ui/Button'
import { UuidCell } from '@/components/ui/table/UuidCell'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChevronsUpDown, CircleCheck, Minus } from 'lucide-react'

export const deskColumns: ColumnDef<ICargoList>[] = [
	{
		accessorKey: 'created_at',
		header: ({ column }) => (
			<Button
				variant='ghost'
				className='hover:bg-transparent p-0'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Опубл. время
				<ChevronsUpDown className='ml-2 size-4' />
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
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Цена
				<ChevronsUpDown className='ml-2 size-4' />
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
		accessorKey: 'price_currency',
		header: 'Валюта',
	},
	{
		accessorKey: 'path_km',
		header: ({ column }) => (
			<Button
				variant='ghost'
				className='hover:bg-transparent p-0'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Путь (км)
				<ChevronsUpDown className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => `${row.original.path_km} км`,
	},
	{
		accessorKey: 'weight_t',
		header: 'Вес (т)',
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
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Дата
				<ChevronsUpDown className='ml-2 size-4' />
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
					?.name ?? '—'
			return transportName
		},
	},
	{
		accessorKey: 'has_offers',
		header: 'Предложения',
		cell: ({ row }) => {
			if (row.original.has_offers)
				return <CircleCheck className='size-5 text-success-400' />
			return <Minus className='size-5 text-neutral-400' />
		},
	},
	{
		accessorKey: 'uuid',
		header: 'ID',
		cell: ({ row }) => <UuidCell uuid={row.original.uuid} />,
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }) => <CargoActionsDropdown cargo={row.original} />,
		enableSorting: false,
		enableHiding: false,
	},
]


