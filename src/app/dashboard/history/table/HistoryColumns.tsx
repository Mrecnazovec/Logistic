'use client'

import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Star } from 'lucide-react'

export const historyColumns: ColumnDef<ICargoList>[] = [
	{
		accessorKey: 'company_name',
		header: 'Заказчик',
	},
	{
		accessorKey: '',
		header: 'Посредник',
	},
	{
		accessorKey: 'route_km',
		header: ({ column }) => (
			<Button variant='ghost' className='hover:bg-transparent p-0' onClick={(event) => cycleColumnSort(event, column)}>
				Путь (км)
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => `${row.original.route_km} км`,
	},
	{
		accessorKey: 'weight_t',
		header: 'Вес (т)',
		cell: ({row}) => `${row.original.weight_t} т`

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
		accessorKey: 'price_currency',
		header: 'Валюта',
	},
	{
		accessorKey: 'path_km',
		header: 'Рейтинг',
		cell: () => <span className='flex items-center gap-2 font-medium'>
			<Star className='size-4 text-yellow-400 fill-yellow-400' />
			5
		</span>
	},
	{
		accessorKey: 'load_date',
		header: ({ column }) => (
			<Button
				variant='ghost'
				className='hover:bg-transparent p-0'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Дата завершения
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


]

