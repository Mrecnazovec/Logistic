import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { SortIcon } from '@/components/ui/table/SortIcon'
import { cycleColumnSort } from '@/components/ui/table/utils'
import { formatDateValue } from '@/lib/formatters'
import { IAgreement } from '@/shared/types/Agreement.interface'
import { ColumnDef } from '@tanstack/react-table'
import { Minus } from 'lucide-react'

type Translator = (key: string, params?: Record<string, string | number>) => string

export const createAgreementColumns = (t: Translator): ColumnDef<IAgreement>[] => {
	const statusLabels: Record<IAgreement['status'], string> = {
		pending: t('transportation.agreement.status.pending'),
		accepted: t('transportation.agreement.status.accepted'),
		expired: t('transportation.agreement.status.expired'),
		cancelled: t('transportation.agreement.status.cancelled'),
	}

	const acceptedLabel = (value?: boolean | null) => {
		if (value === null || value === undefined) return <Minus className='size-4' />
		return value ? t('transportation.agreement.accepted.yes') : t('transportation.agreement.accepted.no')
	}

	const participantName = (agreement: IAgreement, role: string) => {
		const participant = agreement.participants?.find((item) => item.role === role)
		return participant?.full_name || <Minus className='size-4' />
	}
	const executorName = (agreement: IAgreement) => {
		const carrier = agreement.participants?.find((item) => item.role === 'CARRIER')
		if (carrier?.full_name) return carrier.full_name
		const logistic = agreement.participants?.find((item) => item.role === 'LOGISTIC')
		return logistic?.full_name || <Minus className='size-4' />
	}

	return [
		{ accessorKey: 'id', header: t('transportation.agreement.columns.id'), cell: ({ row }) => <UuidCopy id={row.original.id} /> },
		{
			accessorKey: 'status',
			header: t('transportation.agreement.columns.status'),
			cell: ({ row }) => statusLabels[row.original.status] || row.original.status,
		},
		{
			accessorKey: 'loading_city',
			header: t('transportation.agreement.columns.loading'),
			cell: ({ row }) => {
				const city = row.original.loading_city
				const date = formatDateValue(row.original.loading_date, 'dd.MM.yyyy', '-')
				if (!city) return <Minus className='size-4' />
				return (
					<div className='flex flex-col'>
						<span>{city}</span>
						<span className='text-sm text-muted-foreground'>{date}</span>
					</div>
				)
			},
		},
		{
			accessorKey: 'unloading_city',
			header: t('transportation.agreement.columns.unloading'),
			cell: ({ row }) => {
				const city = row.original.unloading_city
				const date = formatDateValue(row.original.unloading_date, 'dd.MM.yyyy', '-')
				if (!city) return <Minus className='size-4' />
				return (
					<div className='flex flex-col'>
						<span>{city}</span>
						<span className='text-sm text-muted-foreground'>{date}</span>
					</div>
				)
			},
		},

		{
			accessorKey: 'created_at',
			header: t('transportation.agreement.columns.createdAt'),
			cell: ({ row }) => formatDateValue(row.original.created_at, 'dd.MM.yyyy HH:mm', '-'),
		},
		{
			accessorKey: 'expires_at',
			header: ({ column }) => (t('transportation.agreement.columns.expiresAt')
			),
			cell: ({ row }) => formatDateValue(row.original.expires_at, 'dd.MM.yyyy HH:mm', '-'),
		},
		{
			id: 'participant_customer',
			header: t('transportation.agreement.columns.customerName'),
			cell: ({ row }) => (
				<div className='flex flex-col'>
					<span>{participantName(row.original, 'CUSTOMER')}</span>
					<span className='text-sm text-muted-foreground'>{acceptedLabel(row.original.accepted_by_customer)}</span>
				</div>
			),
		},
		{
			id: 'participant_executor',
			header: t('transportation.agreement.columns.executorName'),
			cell: ({ row }) => (
				<div className='flex flex-col'>
					<span>{executorName(row.original)}</span>
					<span className='text-sm text-muted-foreground'>
						{acceptedLabel(Boolean(row.original.accepted_by_carrier || row.original.accepted_by_logistic))}
					</span>
				</div>
			),
		},
	]
}
