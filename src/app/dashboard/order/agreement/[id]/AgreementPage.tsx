'use client'

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { useAcceptAgreement } from '@/hooks/queries/agreements/useAcceptAgreement'
import { useGetAgreement } from '@/hooks/queries/agreements/useGetAgreement'
import { useRejectAgreement } from '@/hooks/queries/agreements/useRejectAgreement'
import { formatDateTimeValue } from '@/lib/formatters'
import type { IAgreement } from '@/shared/types/Agreement.interface'
import { useParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'

const statusLabels: Record<IAgreement['status'], string> = {
	pending: 'Ожидает подтверждения',
	accepted: 'Принято',
	expired: 'Истекло',
	cancelled: 'Отменено',
}

const booleanLabel = (value?: boolean | null) => {
	if (value === null || value === undefined) return '—'
	return value ? 'Да' : 'Нет'
}

export function AgreementPage() {
	const params = useParams<{ id: string }>()
	const router = useRouter()
	const agreementId = params?.id

	const { data: agreement, isLoading } = useGetAgreement(agreementId)
	const { acceptAgreement, isLoadingAcceptAgreement } = useAcceptAgreement()
	const { rejectAgreement, isLoadingRejectAgreement } = useRejectAgreement()

	const isProcessing = isLoadingAcceptAgreement || isLoadingRejectAgreement

	const details = useMemo(() => {
		if (!agreement) return []

		return [
			{ label: 'Статус', value: statusLabels[agreement.status] ?? '—' },
			{ label: 'Истекает', value: formatDateTimeValue(agreement.expires_at, '—') },
			{ label: 'Создано', value: formatDateTimeValue(agreement.created_at, '—') },
			{ label: 'Оффер ID', value: agreement.offer_id ?? '—' },
			{ label: 'Груз ID', value: agreement.cargo_id ?? '—' },
			{ label: 'Подтверждено заказчиком', value: booleanLabel(agreement.accepted_by_customer) },
			{ label: 'Подтверждено перевозчиком', value: booleanLabel(agreement.accepted_by_carrier) },
			{ label: 'Подтверждено посредником', value: booleanLabel(agreement.accepted_by_logistic) },
		]
	}, [agreement])

	const handleAccept = () => {
		if (!agreementId) return
		acceptAgreement(agreementId, {
			onSuccess: () => router.refresh(),
		})
	}

	const handleReject = () => {
		if (!agreementId) return
		rejectAgreement(agreementId, {
			onSuccess: () => router.refresh(),
		})
	}

	if (isLoading) {
		return (
			<div className='w-full h-full rounded-4xl bg-background p-8 flex items-center justify-center'>
				<Loader />
			</div>
		)
	}

	if (!agreement) {
		return (
			<div className='w-full h-full rounded-4xl bg-background p-8 flex items-center justify-center'>
				<p className='text-muted-foreground'>Соглашение не найдено.</p>
			</div>
		)
	}

	return (
		<div className='w-full h-full rounded-4xl bg-background p-8 space-y-6'>
			<Card className='rounded-3xl border-none shadow-md'>
				<CardHeader className='flex-row items-center justify-between gap-4 pb-4'>
					<div className='space-y-1'>
						<CardTitle className='text-2xl font-semibold flex items-center gap-3'>Соглашение <UuidCopy id={agreement.id} isPlaceholder /></CardTitle>
						<p className='text-sm text-muted-foreground'>Подробности соглашения и действия</p>
					</div>
				</CardHeader>

				<CardContent className='grid gap-3 sm:grid-cols-2'>
					{details.map(({ label, value }) => (
						<div key={label} className='flex flex-col gap-1 rounded-xl bg-muted/60 p-3'>
							<span className='text-xs uppercase tracking-wide text-muted-foreground'>{label}</span>
							<span className='text-base font-medium text-foreground break-words'>{value}</span>
						</div>
					))}
				</CardContent>

				<CardFooter className='flex flex-wrap gap-3 justify-end pt-4'>
					<Button
						onClick={handleReject}
						disabled={isProcessing}
						className='bg-error-500 hover:bg-error-400 text-white'

					>
						{isLoadingRejectAgreement ? 'Отклонение...' : 'Отклонить'}
					</Button>
					<Button
						onClick={handleAccept}
						disabled={isProcessing}
						className='bg-success-500 hover:bg-success-400 text-white'
					>
						{isLoadingAcceptAgreement ? 'Принятие...' : 'Принять'}
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
