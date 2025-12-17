import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { DEFAULT_PLACEHOLDER, formatDateValue, formatPlace, formatPriceValue, parseDateToTimestamp } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { ColumnDef } from '@tanstack/react-table'

export const createTransportationColumns = (role?: RoleEnum): ColumnDef<ICargoList>[] => [
	{
		accessorKey: 'uuid',
		header: 'ID',
		cell: ({ row }) => <UuidCopy uuid={row.original.uuid} />,
	},
	{
		accessorKey: 'company_name',
		header: () => (role === RoleEnum.CUSTOMER ? 'Перевозчик' : 'Заказчик'),
	},
	{
		accessorKey: 'created_at',
		header: () => (role === RoleEnum.CARRIER ? 'Заказчик' : 'Перевозчик'),
		cell: ({ row }) => <p>{row.original.company_name}</p>,
	},
	{
		id: 'origin',
		header: ({ column }) => (
			<Button
				variant='ghost'
				className='hover:bg-transparent p-0'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Откуда / дата погрузки
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => {
			const { origin_city, origin_country, load_date } = row.original
			return (
				<div className='flex flex-col'>
					<span>{formatPlace(origin_city, origin_country, DEFAULT_PLACEHOLDER)}</span>
					<span className='text-muted-foreground text-sm'>
						{formatDateValue(load_date, 'dd.MM.yyyy', DEFAULT_PLACEHOLDER)}
					</span>
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
				className='hover:bg-transparent p-0'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Куда / дата выгрузки
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => {
			const { destination_city, destination_country, delivery_date } = row.original
			return (
				<div className='flex flex-col'>
					<span>{formatPlace(destination_city, destination_country, DEFAULT_PLACEHOLDER)}</span>
					<span className='text-muted-foreground text-sm'>
						{formatDateValue(delivery_date, 'dd.MM.yyyy', DEFAULT_PLACEHOLDER)}
					</span>
				</div>
			)
		},
		sortingFn: (a, b) => parseDateToTimestamp(a.original.delivery_date) - parseDateToTimestamp(b.original.delivery_date),
	},
	{
		accessorKey: 'transport_type',
		header: 'Транспорт',
		cell: ({ row }) => {
			const transportName = TransportSelect.find((t) => t.type === row.original.transport_type)?.symb ?? DEFAULT_PLACEHOLDER
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
				className='hover:bg-transparent p-0'
				onClick={(event) => cycleColumnSort(event, column)}
			>
				Стоимость
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
		accessorKey: 'is_hidden',
		header: 'Visibility',
		cell: ({ row }) => {
			const hidden = Boolean(row.original.is_hidden)

			return (
				<div
					className={cn(
						'rounded-full px-3 py-1 text-xs font-semibold border inline-flex items-center',
						hidden ? 'bg-red-100 border-red-200 text-red-700' : 'bg-emerald-100 border-emerald-200 text-emerald-700',
					)}
				>
					<span>{hidden ? 'Hidden' : 'Visible'}</span>
				</div>
			)
		},
	},
	{
		accessorKey: 'price_per_km',
		header: 'Цена за км',
	},
]
