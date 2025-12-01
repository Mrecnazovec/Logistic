import { formatDateValue, formatPriceValue, parseDateToTimestamp } from '@/lib/formatters'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { IOrderList } from '@/shared/types/Order.interface'
import { ColumnDef } from '@tanstack/react-table'
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
			const formattedDate = load_date ? formatDateValue(load_date) : <Minus />
			return (
				<div className='flex flex-col'>
					<span>{`${origin_city}`}</span>
					<span className='text-muted-foreground text-sm'>{formattedDate}</span>
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
				Куда / дата доставки
				<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
			</Button>
		),
		cell: ({ row }) => {
			const { destination_city, delivery_date } = row.original
			const formattedDate = delivery_date ? formatDateValue(delivery_date) : <Minus />
			return (
				<div className='flex flex-col'>
					<span>{`${destination_city}`}</span>
					<span className='text-muted-foreground text-sm'>{formattedDate}</span>
				</div>
			)
		},
		sortingFn: (a, b) => parseDateToTimestamp(a.original.delivery_date) - parseDateToTimestamp(b.original.delivery_date),
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
		accessorKey: 'documents_count',
		header: 'Документы',
		cell: ({ row }) => {
			if (row.original.documents_count === 0) return <div className='rounded-full bg-[#F8F9FC] border border-[#D5D9EB] size-7 flex items-center justify-center'>{row.original.documents_count}</div>
			return <div className='rounded-full bg-[#F4F3FF] border border-[#D9D6FE] size-7 flex items-center justify-center'>{row.original.documents_count}</div>
		},

	},
	{
		accessorKey: 'price_per_km',
		header: 'Цена за км',
		cell: ({ row }) => Number(row.original.price_per_km || 0).toLocaleString(),

	},
]
