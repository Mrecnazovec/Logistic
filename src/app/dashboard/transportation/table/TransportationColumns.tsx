import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { formatDateValue, formatPriceValue, parseDateToTimestamp } from '@/lib/formatters'
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
        accessorKey: 'carrier_name',
        header: 'Перевозчик',
    },
    {
        accessorKey: 'logistic_name',
        header: 'Посредник',
    },
    {
        id: 'origin',
        header: ({ column }) => (
            <Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
                Откуда / дата погрузки
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
                Куда / дата доставки
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
        header: 'Валюта',
    },
    {
        accessorKey: 'price_total',
        header: 'Цена',
        cell: ({ row }) => formatPriceValue(row.original.price_total, row.original.currency),
    },
    {
        accessorKey: 'documents_count',
        header: 'Документы',
        cell: ({ row }) => (
            <div className='flex size-7 items-center justify-center rounded-full border bg-[#F8F9FC]'>
                {row.original.documents_count ?? 0}
            </div>
        ),
    },
    {
        accessorKey: 'price_per_km',
        header: 'Цена за км',
        cell: ({ row }) => Number(row.original.price_per_km || 0).toLocaleString(),
    },
]
