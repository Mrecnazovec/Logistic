'use client'

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { cn } from '@/lib/utils'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { useRoleStore } from '@/store/useRoleStore'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'


export const transportationColumns: ColumnDef<ICargoList>[] = [
	{
		accessorKey: 'uuid',
		header: 'ID',
		cell: ({ row }) => <UuidCopy uuid={row.original.uuid} />,
	},
	{
		accessorKey: 'company_name',
		header: () => {
			const { role } = useRoleStore()
			if (role !== RoleEnum.CUSTOMER) return 'Заказчик'
			return 'Посредник'
		},
	},
	{
		accessorKey: 'created_at',

		header: () => {
			const { role } = useRoleStore()
			if (role !== RoleEnum.CARRIER) return 'Водитель'
			return 'Посредник'
		},
		cell: ({ row }) =>
			<p>{row.original.company_name}</p>

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
		accessorKey: 'is_hidden',
		header: 'Документы',
		cell: ({ row }) => <div className={cn('rounded-full size-7 border-2 flex items-center justify-center font-medium', Number(row.id) % 4 !== 0 && 'bg-purple-200/50 border-purple-200 text-purple-700')}><span className=''>{Number(row.id) % 4}</span></div>
	},
	{
		accessorKey: 'price_per_km',
		header: 'Цена/Км'
	},

]


