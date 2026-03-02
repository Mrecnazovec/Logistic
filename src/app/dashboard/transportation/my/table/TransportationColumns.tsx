import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { formatDateValue, formatPricePerKmValue, formatPriceValue, parseDateToTimestamp } from '@/lib/formatters'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { IOrderList } from '@/shared/types/Order.interface'
import { ColumnDef } from '@tanstack/react-table'
import { Minus } from 'lucide-react'

type Translator = (key: string, params?: Record<string, string | number>) => string

export const createTransportationColumns = (t: Translator, role?: RoleEnum): ColumnDef<IOrderList>[] => [
		{
				accessorKey: 'id',
				header: t('transportation.columns.id'),
				cell: ({ row }) => <UuidCopy id={row.original.id} />,
		},
		{
				accessorKey: role === RoleEnum.CUSTOMER ? 'carrier_name' : 'customer_name',
				header: role === RoleEnum.CUSTOMER ? t('transportation.columns.carrier') : t('transportation.columns.customer'),
				cell: ({ row }) => (role === RoleEnum.CUSTOMER ? row.original.roles.carrier?.name : row.original.roles.customer.name),

		},
		{
				accessorKey: role === RoleEnum.LOGISTIC ? 'carrier_name' : 'logistic_name',
				header: role === RoleEnum.LOGISTIC ? t('transportation.columns.carrier') : t('transportation.columns.logistic'),
				cell: ({ row }) => (role === RoleEnum.LOGISTIC ? row.original.roles.carrier?.name : row.original.roles.logistic?.name),
		},
		{
				id: 'origin',
				header: ({ column }) => (
						<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
								{t('transportation.columns.origin')}
								<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
						</Button>
				),
				cell: ({ row }) => {
						const { origin_city, load_date } = row.original
						const formattedDate = load_date ? formatDateValue(load_date) : <Minus />
						return (
								<div className='flex flex-col'>
										<span>{origin_city}</span>
										<span className='text-sm text-muted-foreground'>{formattedDate}</span>
								</div>
						)
				},
				sortingFn: (a, b) => parseDateToTimestamp(a.original.load_date) - parseDateToTimestamp(b.original.load_date),
		},
		{
				id: 'destination',
				header: ({ column }) => (
						<Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
								{t('transportation.columns.destination')}
								<SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
						</Button>
				),
				cell: ({ row }) => {
						const { destination_city, delivery_date } = row.original
						const formattedDate = delivery_date ? formatDateValue(delivery_date) : <Minus />
						return (
								<div className='flex flex-col'>
										<span>{destination_city}</span>
										<span className='text-sm text-muted-foreground'>{formattedDate}</span>
								</div>
						)
				},
				sortingFn: (a, b) => parseDateToTimestamp(a.original.delivery_date) - parseDateToTimestamp(b.original.delivery_date),
		},
		{
				accessorKey: 'currency',
				header: t('transportation.columns.currency'),
		},
		{
				accessorKey: 'price_total',
				header: t('transportation.columns.price'),
				cell: ({ row }) => formatPriceValue(row.original.price_total, row.original.currency),
		},
		{
				accessorKey: 'documents_count',
				header: t('transportation.columns.documents'),
				cell: ({ row }) => (
						<div className='flex size-7 items-center justify-center rounded-full border bg-[#F8F9FC]'>
								{row.original.documents_count ?? 0}
						</div>
				),
		},
		{
				accessorKey: 'price_per_km',
				header: t('transportation.columns.pricePerKm'),
				cell: ({ row }) => formatPricePerKmValue(row.original.price_per_km, row.original.currency),
		},
]
