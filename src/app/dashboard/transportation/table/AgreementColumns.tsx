import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { formatDateValue } from '@/lib/formatters'
import { IAgreement } from '@/shared/types/Agreement.interface'
import { ColumnDef } from '@tanstack/react-table'
import { Minus } from 'lucide-react'

const statusLabels: Record<IAgreement['status'], string> = {
    pending: 'Ожидает подтверждения',
    accepted: 'Принято',
    expired: 'Истекло',
    cancelled: 'Отменено',
}

const booleanLabel = (value?: boolean | null) => {
    if (value === null || value === undefined) return <Minus className='size-4' />
    return value ? 'Да' : 'Нет'
}

export const createAgreementColumns = (): ColumnDef<IAgreement>[] => [
    { accessorKey: 'id', header: 'ID', cell: ({ row }) => <UuidCopy id={row.original.id} /> },
    {
        accessorKey: 'status',
        header: 'Статус',
        cell: ({ row }) => statusLabels[row.original.status] || row.original.status,
    },
    {
        accessorKey: 'offer_id',
        header: 'Оффер ID',
        cell: ({ row }) => row.original.offer_id ?? <Minus className='size-4' />,
    },
    {
        accessorKey: 'cargo_id',
        header: 'Груз ID',
        cell: ({ row }) => row.original.cargo_id ?? <Minus className='size-4' />,
    },
    {
        accessorKey: 'expires_at',
        header: ({ column }) => (
            <Button variant='ghost' className='p-0 hover:bg-transparent' onClick={(event) => cycleColumnSort(event, column)}>
                Истекает
                <SortIcon direction={column.getIsSorted()} className='ml-2 size-4' />
            </Button>
        ),
        cell: ({ row }) => formatDateValue(row.original.expires_at, 'dd.MM.yyyy HH:mm', '—'),
        sortingFn: (a, b) => new Date(a.original.expires_at).getTime() - new Date(b.original.expires_at).getTime(),
    },
    {
        accessorKey: 'created_at',
        header: 'Создано',
        cell: ({ row }) => formatDateValue(row.original.created_at, 'dd.MM.yyyy HH:mm', '—'),
        sortingFn: (a, b) => new Date(a.original.created_at).getTime() - new Date(b.original.created_at).getTime(),
    },
    { accessorKey: 'accepted_by_customer', header: 'Заказчик', cell: ({ row }) => booleanLabel(row.original.accepted_by_customer) },
    { accessorKey: 'accepted_by_carrier', header: 'Перевозчик', cell: ({ row }) => booleanLabel(row.original.accepted_by_carrier) },
    { accessorKey: 'accepted_by_logistic', header: 'Посредник', cell: ({ row }) => booleanLabel(row.original.accepted_by_logistic) },
]
