import { formatPriceValue } from '@/components/card/cardFormatters'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { IOrderList } from '@/shared/types/Order.interface'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Minus } from 'lucide-react'



export const createTransportationColumns = (role?: RoleEnum): ColumnDef<IOrderList>[] => [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => <UuidCopy id={row.original.id} />,
	},
	{
		accessorKey: `${role === RoleEnum.CUSTOMER ? 'carrier_name' : 'customer_name'}`,
		header: () => (role === RoleEnum.CUSTOMER ? 'Перевозчик' : 'Заказчик'),
	},
	{
		accessorKey: `${role === RoleEnum.LOGISTIC ? 'carrier_name' : 'logistic_name'}`,
		header: () => (role === RoleEnum.LOGISTIC ? 'Перевозчик' : 'Посредник'),
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
			const { origin_city, load_date } = row.original
			const formattedDate = load_date
				? format(new Date(load_date), 'dd.MM.yyyy', { locale: ru })
				: <Minus />
			return (
				<div className='flex flex-col'>
					<span>{`${origin_city}`}</span>
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
				Куда / дата доставки
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => {
			const { destination_city, delivery_date } = row.original
			const formattedDate =
				delivery_date && typeof delivery_date === 'string'
					? format(new Date(delivery_date), 'dd.MM.yyyy', { locale: ru })
					: <Minus />
			return (
				<div className='flex flex-col'>
					<span>{`${destination_city}`}</span>
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
		accessorKey: 'currency',
		header: 'Валюта',
	},
	{
		accessorKey: 'price_total',
		header: 'Цена',
		cell: ({ row }) => formatPriceValue(row.original.price_total, row.original.currency),
	},
	// {
	// 	accessorKey: 'price_total',
	// 	header: ({ column }) => (
	// 		<Button
	// 			variant='ghost'
	// 			className='hover:bg-transparent p-0'
	// 			onClick={(event) => cycleColumnSort(event, column)}
	// 		>
	// 			Стоимость
	// 			<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
	// 		</Button>
	// 	),
	// 	cell: ({ row }) => formatCurrencyValue(row.original.price_value, row.original.price_currency),
	// 	sortingFn: (a, b) => {
	// 		const priceA = Number(a.original.price_uzs || 0)
	// 		const priceB = Number(b.original.price_uzs || 0)
	// 		return priceA - priceB
	// 	},
	// },
	// {
	// 	accessorKey: '',
	// 	header: 'Скрыто',
	// 	cell: ({ row }) => (
	// 		<div
	// 			className={cn(
	// 				'rounded-full size-7 border-2 flex items-center justify-center font-medium',
	// 				Number(row.id) % 4 !== 0 && 'bg-purple-200/50 border-purple-200 text-purple-700',
	// 			)}
	// 		>
	// 			<span>{Number(row.id) % 4}</span>
	// 		</div>
	// 	),
	// },
	{
		accessorKey: 'price_per_km',
		header: 'Цена за км',
		cell: ({ row }) => Number(row.original.price_per_km || 0).toLocaleString(),

	},
]
