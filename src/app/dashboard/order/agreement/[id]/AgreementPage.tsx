'use client'

import { CheckCircle2, Truck } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Loader } from '@/components/ui/Loader'
import { Checkbox } from '@/components/ui/Сheckbox'
import { useAcceptAgreement } from '@/hooks/queries/agreements/useAcceptAgreement'
import { useGetAgreement } from '@/hooks/queries/agreements/useGetAgreement'
import { useRejectAgreement } from '@/hooks/queries/agreements/useRejectAgreement'
import { formatDateValue } from '@/lib/formatters'
import type { IAgreementDetail } from '@/shared/types/Agreement.interface'

const EMPTY_VALUE = '-'

const statusMeta: Record<IAgreementDetail['status'], { label: string; className: string }> = {
	pending: { label: 'Ожидает подтверждения', className: 'bg-warning-100 text-warning-700 border border-warning-200' },
	accepted: { label: 'Принято', className: 'bg-success-100 text-success-700 border border-success-200' },
	expired: { label: 'Истекло', className: 'bg-muted text-muted-foreground border border-border' },
	cancelled: { label: 'Отменено', className: 'bg-error-100 text-error-700 border border-error-200' },
}

const formatCountdown = (ms: number) => {
	const totalSeconds = Math.max(Math.floor(ms / 1000), 0)
	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	const seconds = totalSeconds % 60

	if (hours > 0) {
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
	}

	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const withFallback = (value?: string | number | null) =>
	value === null || value === undefined || value === '' ? EMPTY_VALUE : String(value)

export function AgreementPage() {
	const params = useParams<{ id: string }>()
	const router = useRouter()
	const agreementId = params?.id

	const { data: agreement, isLoading } = useGetAgreement(agreementId)
	const { acceptAgreement, isLoadingAcceptAgreement } = useAcceptAgreement()
	const { rejectAgreement, isLoadingRejectAgreement } = useRejectAgreement()

	const [remainingMs, setRemainingMs] = useState(0)
	const [isTermsOpen, setIsTermsOpen] = useState(false)
	const [isTermsChecked, setIsTermsChecked] = useState(false)

	const expiresAtMs = agreement?.expires_at ? new Date(agreement.expires_at).getTime() : 0
	useEffect(() => {
		if (!expiresAtMs) return

		const update = () => setRemainingMs(Math.max(expiresAtMs - Date.now(), 0))
		const timeoutId = window.setTimeout(update, 0)
		const intervalId = window.setInterval(update, 1000)

		return () => {
			window.clearTimeout(timeoutId)
			window.clearInterval(intervalId)
		}
	}, [expiresAtMs])

	const displayedRemainingMs = expiresAtMs ? remainingMs : 0
	const createdAtMs = agreement?.created_at
		? new Date(agreement.created_at).getTime()
		: expiresAtMs - displayedRemainingMs
	const totalDurationMs = Math.max(expiresAtMs - createdAtMs, 0)
	const progress = totalDurationMs ? Math.min(displayedRemainingMs / totalDurationMs, 1) : 0

	const isProcessing = isLoadingAcceptAgreement || isLoadingRejectAgreement

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
			<div className='w-full h-full rounded-4xl bg-background md:p-8 p-4 flex items-center justify-center'>
				<Loader />
			</div>
		)
	}

	if (!agreement) {
		return (
			<div className='w-full h-full rounded-4xl bg-background md:p-8 p-4 flex items-center justify-center'>
				<p className='text-muted-foreground'>Соглашение не найдено.</p>
			</div>
		)
	}

	const status = statusMeta[agreement.status] ?? statusMeta.pending
	const totalDistance = agreement.total_distance_km ? `${agreement.total_distance_km} км` : EMPTY_VALUE
	const travelTime = withFallback(agreement.travel_time)

	return (
		<div className='w-full h-full rounded-4xl bg-background md:p-8 p-4 space-y-10'>
			<div className='flex flex-wrap items-center justify-between gap-6'>
				<div className='text-sm text-muted-foreground'>
					<div className='flex items-center gap-4'>Соглашение № <UuidCopy id={agreement.id} isPlaceholder /></div>
					<span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
						{status.label}
					</span>
				</div>
				<div className='relative flex items-center justify-center'>
					<div
						className='flex xs:size-20 size-10 items-center justify-center rounded-full p-[6px]'
						style={{
							background: `conic-gradient(#2563eb ${progress * 360}deg, #e5e7eb 0deg)`,
						}}
					>
						<div className='flex size-full items-center justify-center rounded-full bg-background xs:text-sm text-xs font-semibold text-foreground'>
							{formatCountdown(displayedRemainingMs)}
						</div>
					</div>
				</div>
			</div>

			<div className='grid gap-10 lg:grid-cols-3'>
				{agreement.customer_id ? (<div className='space-y-4'>
					<p className='text-brand font-semibold'>Информация о заказчике</p>
					<div className='space-y-3'>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>ID</span>
							<span className='text-end font-medium'><UuidCopy id={agreement.customer_id} isPlaceholder /></span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>ФИО</span>
							<span className='text-end font-medium'><ProfileLink name={agreement.customer_full_name} id={agreement.customer_id} /></span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>Телефон</span>
							<span className='text-end font-medium'>{withFallback(agreement.customer_phone)}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>Email</span>
							<span className='text-end font-medium'>{withFallback(agreement.customer_email)}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>Дата регистрации</span>
							<span className='text-end font-medium'>
								{formatDateValue(agreement.customer_registered_at, 'dd/MM/yyyy', EMPTY_VALUE)}
							</span>
						</p>
					</div>
				</div>) : null}

				{agreement.logistic_id ? (
					<div className='space-y-4'>
						<p className='text-brand font-semibold'>Информация о посреднике</p>
						<div className='space-y-3'>
							<p className='flex justify-between gap-6'>
								<span className='text-grayscale'>ID</span>
								<span className='text-end font-medium'><UuidCopy id={agreement.logistic_id} isPlaceholder /></span>
							</p>
							<p className='flex justify-between gap-6'>
								<span className='text-grayscale'>ФИО</span>
								<span className='text-end font-medium'><ProfileLink id={agreement.logistic_id} name={agreement.logistic_full_name} /></span>
							</p>
							<p className='flex justify-between gap-6'>
								<span className='text-grayscale'>Телефон</span>
								<span className='text-end font-medium'>{withFallback(agreement.logistic_phone)}</span>
							</p>
							<p className='flex justify-between gap-6'>
								<span className='text-grayscale'>Email</span>
								<span className='text-end font-medium'>{withFallback(agreement.logistic_email)}</span>
							</p>
							<p className='flex justify-between gap-6'>
								<span className='text-grayscale'>Дата регистрации</span>
								<span className='text-end font-medium'>
									{formatDateValue(agreement.logistic_registered_at, 'dd/MM/yyyy', EMPTY_VALUE)}
								</span>
							</p>
						</div>
					</div>
				) : null}

				{agreement.carrier_id ? (
					<div className='space-y-4'>
						<p className='text-brand font-semibold'>Информация о водителе</p>
						<div className='space-y-3'>
							<p className='flex justify-between gap-6'>
								<span className='text-grayscale'>ID</span>
								<span className='text-end font-medium'><UuidCopy id={agreement.carrier_id} isPlaceholder /></span>
							</p>
							<p className='flex justify-between gap-6'>
								<span className='text-grayscale'>ФИО</span>
								<span className='text-end font-medium'><ProfileLink name={agreement.carrier_full_name} id={agreement.carrier_id} /></span>
							</p>
							<p className='flex justify-between gap-6'>
								<span className='text-grayscale'>Телефон</span>
								<span className='text-end font-medium'>{withFallback(agreement.carrier_phone)}</span>
							</p>
							<p className='flex justify-between gap-6'>
								<span className='text-grayscale'>Email</span>
								<span className='text-end font-medium'>{withFallback(agreement.carrier_email)}</span>
							</p>
							<p className='flex justify-between gap-6'>
								<span className='text-grayscale'>Дата регистрации</span>
								<span className='text-end font-medium'>
									{formatDateValue(agreement.carrier_registered_at, 'dd/MM/yyyy', EMPTY_VALUE)}
								</span>
							</p>
						</div>
					</div>
				) : null}
			</div>

			<div className='border-t border-b border-border/60 py-6'>
				<div className='grid gap-8 md:grid-cols-3'>
					<div className='space-y-4'>
						<p className='text-brand font-semibold'>Погрузка</p>
						<div className='space-y-3 text-sm'>
							<p className='flex items-center justify-between gap-6'>
								<span className='text-muted-foreground'>Город</span>
								<span className='text-end font-medium'>{withFallback(agreement.loading_city)}</span>
							</p>
							<p className='flex items-center justify-between gap-6'>
								<span className='text-muted-foreground'>Улица</span>
								<span className='text-end font-medium'>{withFallback(agreement.loading_address)}</span>
							</p>
							<p className='flex items-center justify-between gap-6'>
								<span className='text-muted-foreground'>Дата</span>
								<span className='text-end font-medium'>
									{formatDateValue(agreement.loading_date, 'dd/MM/yyyy', EMPTY_VALUE)}
								</span>
							</p>
						</div>
					</div>
					<div className='space-y-4'>
						<p className='text-brand font-semibold'>Разгрузка</p>
						<div className='space-y-3 text-sm'>
							<p className='flex items-center justify-between gap-6'>
								<span className='text-muted-foreground'>Город</span>
								<span className='text-end font-medium'>{withFallback(agreement.unloading_city)}</span>
							</p>
							<p className='flex items-center justify-between gap-6'>
								<span className='text-muted-foreground'>Улица</span>
								<span className='text-end font-medium'>{withFallback(agreement.unloading_address)}</span>
							</p>
							<p className='flex items-center justify-between gap-6'>
								<span className='text-muted-foreground'>Дата</span>
								<span className='text-end font-medium'>
									{formatDateValue(agreement.unloading_date, 'dd/MM/yyyy', EMPTY_VALUE)}
								</span>
							</p>
						</div>
					</div>
					<div className='space-y-4'>
						<p className='text-brand font-semibold'>Детали поездки</p>
						<div className='space-y-3 text-sm'>
							<p className='flex items-center justify-between gap-6'>
								<span className='text-muted-foreground'>Общий путь</span>
								<span className='text-end font-medium'>{totalDistance}</span>
							</p>
							<p className='flex items-center justify-between gap-6'>
								<span className='text-muted-foreground'>Время поездки</span>
								<span className='text-end font-medium'>{travelTime}</span>
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className='flex items-start gap-3 text-sm text-muted-foreground'>
				<Checkbox
					id='agreement-terms'
					className='shrink-0'
					checked={isTermsChecked}
					onCheckedChange={(value) => setIsTermsChecked(Boolean(value))}
				/>
				<label htmlFor='agreement-terms' className='min-w-0 cursor-pointer leading-snug'>
					Я ознакомился и согласен с{' '}
					<Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
						<DialogTrigger asChild>
							<button type='button' className='text-brand underline-offset-4 hover:underline'>
								условиями пользования
							</button>
						</DialogTrigger>
						<DialogContent className='max-w-3xl'>
							<DialogHeader>
								<DialogTitle className='text-center text-2xl font-semibold'>Условия соглашения</DialogTitle>
							</DialogHeader>
							<div className='space-y-3 text-sm leading-relaxed text-foreground'>
								<p>
									Принятие задания означает, что все стороны согласны с условиями сотрудничества. Условия
									регулируют порядок взаимодействия, оплату и ответственность.
								</p>
								<ol className='list-decimal space-y-2 pl-5'>
									<li>Заказчик предоставляет корректные данные и принимает результаты работ.</li>
									<li>Посредник организует взаимодействие сторон и соблюдает сроки.</li>
									<li>Водитель обеспечивает безопасную перевозку и своевременную доставку.</li>
									<li>Споры решаются путем переговоров и в рамках действующего законодательства.</li>
								</ol>
							</div>
						</DialogContent>
					</Dialog>
				</label>
			</div>

			<div className='flex flex-wrap items-center gap-6 text-sm'>
				<div className={agreement.accepted_by_customer ? 'flex items-center gap-2 text-success-500' : 'flex items-center gap-2 text-error-500'}>
					<CheckCircle2 className='size-4' aria-hidden />
					<span>
						{agreement.accepted_by_customer
							? 'Заказчик принял условия пользования'
							: 'Заказчик еще не принял условия пользования'}
					</span>
				</div>
				{agreement.logistic_id ? (
					<div className={agreement.accepted_by_logistic ? 'flex items-center gap-2 text-success-500' : 'flex items-center gap-2 text-error-500'}>
						<CheckCircle2 className='size-4' aria-hidden />
						<span>
							{agreement.accepted_by_logistic
								? 'Посредник принял условия пользования'
								: 'Посредник еще не принял условия пользования'}
						</span>
					</div>
				) : null}
				{agreement.carrier_id ? (
					<div className={agreement.accepted_by_carrier ? 'flex items-center gap-2 text-success-500' : 'flex items-center gap-2 text-error-500'}>
						<Truck className='size-4' aria-hidden />
						<span>
							{agreement.accepted_by_carrier
								? 'Водитель принял условия пользования'
								: 'Водитель еще не принял условия пользования'}
						</span>
					</div>
				) : null}
			</div>

			<div className='flex flex-wrap items-center justify-end gap-3'>
				<Button
					variant='destructive'
					onClick={handleReject}
					disabled={isProcessing}
					className='sm:min-w-[160px] max-sm:w-full'
				>
					{isLoadingRejectAgreement ? 'Отклонение...' : 'Отклонить'}
				</Button>
				<Button
					onClick={handleAccept}
					disabled={isProcessing || !isTermsChecked}
					className={
						isTermsChecked
							? 'sm:min-w-[160px] max-sm:w-full bg-success-500 text-white hover:bg-success-600'
							: 'sm:min-w-[160px] max-sm:w-full bg-[#9CA3AF] text-white hover:bg-[#6B7280]'
					}
				>
					{isLoadingAcceptAgreement ? 'Принятие...' : 'Принять'}
				</Button>
			</div>
		</div>
	)
}
