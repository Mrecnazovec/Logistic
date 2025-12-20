'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, Star, Timer, Truck } from 'lucide-react'

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Сheckbox'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/Dialog'
import { Loader } from '@/components/ui/Loader'
import { useAcceptAgreement } from '@/hooks/queries/agreements/useAcceptAgreement'
import { useGetAgreement } from '@/hooks/queries/agreements/useGetAgreement'
import { useRejectAgreement } from '@/hooks/queries/agreements/useRejectAgreement'
import { formatDateValue, formatPriceValue } from '@/lib/formatters'
import { offerService } from '@/services/offers.service'
import type { PriceCurrencyCode } from '@/lib/currency'
import type { IAgreement } from '@/shared/types/Agreement.interface'

const EMPTY_VALUE = '-'

const statusMeta: Record<IAgreement['status'], { label: string; className: string }> = {
	pending: { label: 'Ожидает подтверждения', className: 'bg-warning-100 text-warning-700 border border-warning-200' },
	accepted: { label: 'Завершен', className: 'bg-success-100 text-success-700 border border-success-200' },
	expired: { label: 'Истек', className: 'bg-muted text-muted-foreground border border-border' },
	cancelled: { label: 'Отменен', className: 'bg-error-100 text-error-700 border border-error-200' },
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

	const offerId = agreement?.offer_id ? String(agreement.offer_id) : null
	const { data: offer, isLoading: isLoadingOffer } = useQuery({
		queryKey: ['offer', offerId],
		queryFn: () => offerService.getOfferById(offerId ?? ''),
		enabled: Boolean(offerId),
	})

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
	const createdAtMs = agreement?.created_at ? new Date(agreement.created_at).getTime() : expiresAtMs - displayedRemainingMs
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

	if (isLoading || (offerId && isLoadingOffer)) {
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

	const status = statusMeta[agreement.status] ?? statusMeta.pending

	return (
		<div className='w-full h-full rounded-4xl bg-background p-8 space-y-10'>
			<div className='flex flex-wrap items-center justify-between gap-6'>
				<div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground'>
					<UuidCopy id={agreement.id} isPlaceholder />
				</div>
				<div className='relative flex items-center justify-center'>
					<div
						className='flex size-20 items-center justify-center rounded-full p-[6px]'
						style={{
							background: `conic-gradient(#2563eb ${progress * 360}deg, #e5e7eb 0deg)`,
						}}
					>
						<div className='flex size-full items-center justify-center rounded-full bg-background text-sm font-semibold text-foreground'>
							{formatCountdown(displayedRemainingMs)}
						</div>
					</div>
				</div>
			</div>

			<div className='grid gap-10 lg:grid-cols-3'>
				<div className='space-y-4'>
					<p className='text-brand font-semibold'>Информация о заказчике</p>
					<div className='space-y-3'>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>Заказчик</span>
							<span className='text-end font-medium'>{withFallback(offer?.customer_company)}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>ID</span>
							<span className='text-end font-medium'>{withFallback(offer?.customer_id)}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>ФИО</span>
							<span className='text-end font-medium'>{withFallback(offer?.customer_full_name)}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>Номер</span>
							<span className='text-end font-medium'>{EMPTY_VALUE}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>Почта</span>
							<span className='text-end font-medium'>{EMPTY_VALUE}</span>
						</p>
						<div className='flex justify-between gap-6'>
							<span className='text-grayscale'>Рейтинг</span>
							<span className='flex items-center gap-1 font-medium'>
								<Star className='size-4 text-warning-500' aria-hidden />
								{EMPTY_VALUE}
							</span>
						</div>
					</div>
				</div>

				<div className='space-y-4'>
					<p className='text-brand font-semibold'>Информация о посреднике</p>
					<div className='space-y-3'>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>Посредник</span>
							<span className='text-end font-medium'>{EMPTY_VALUE}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>ID</span>
							<span className='text-end font-medium'>{EMPTY_VALUE}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>ФИО</span>
							<span className='text-end font-medium'>{EMPTY_VALUE}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>Номер</span>
							<span className='text-end font-medium'>{EMPTY_VALUE}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>Почта</span>
							<span className='text-end font-medium'>{EMPTY_VALUE}</span>
						</p>
						<div className='flex justify-between gap-6'>
							<span className='text-grayscale'>Рейтинг</span>
							<span className='flex items-center gap-1 font-medium'>
								<Star className='size-4 text-warning-500' aria-hidden />
								{EMPTY_VALUE}
							</span>
						</div>
					</div>
				</div>

				<div className='space-y-4'>
					<p className='text-brand font-semibold'>Информация о водителе</p>
					<div className='space-y-3'>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>Название компании</span>
							<span className='text-end font-medium'>{withFallback(offer?.carrier_company)}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>ID</span>
							<span className='text-end font-medium'>{withFallback(offer?.carrier_id)}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>ФИО</span>
							<span className='text-end font-medium'>{withFallback(offer?.carrier_full_name)}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>Номер</span>
							<span className='text-end font-medium'>{withFallback(offer?.phone)}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>Почта</span>
							<span className='text-end font-medium'>{withFallback(offer?.email)}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>Транспорт</span>
							<span className='text-end font-medium'>{withFallback(offer?.transport_type_display)}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>Номер машины</span>
							<span className='text-end font-medium'>{EMPTY_VALUE}</span>
						</p>
						<p className='flex justify-between gap-6'>
							<span className='text-grayscale'>Номер прав</span>
							<span className='text-end font-medium'>{EMPTY_VALUE}</span>
						</p>
						<div className='flex justify-between gap-6'>
							<span className='text-grayscale'>Рейтинг</span>
							<span className='flex items-center gap-1 font-medium'>
								<Star className='size-4 text-warning-500' aria-hidden />
								{withFallback(offer?.carrier_rating)}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className='h-px w-full bg-grayscale/60' />

			<div className='grid gap-10 lg:grid-cols-3'>
				<div className='space-y-4'>
					<p className='text-brand font-semibold'>Погрузка</p>
					<p className='flex justify-between gap-6'>
						<span className='text-grayscale'>Город</span>
						<span className='text-end font-medium'>
							{offer?.origin_city ? `${offer.origin_city}, ${offer.origin_country}` : EMPTY_VALUE}
						</span>
					</p>
					<p className='flex justify-between gap-6'>
						<span className='text-grayscale'>Улица</span>
						<span className='text-end font-medium'>{EMPTY_VALUE}</span>
					</p>
					<p className='flex justify-between gap-6'>
						<span className='text-grayscale'>Дата</span>
						<span className='text-end font-medium'>{formatDateValue(offer?.load_date, 'dd/MM/yyyy', EMPTY_VALUE)}</span>
					</p>
				</div>

				<div className='space-y-4'>
					<p className='text-brand font-semibold'>Разгрузка</p>
					<p className='flex justify-between gap-6'>
						<span className='text-grayscale'>Город</span>
						<span className='text-end font-medium'>
							{offer?.destination_city ? `${offer.destination_city}, ${offer.destination_country}` : EMPTY_VALUE}
						</span>
					</p>
					<p className='flex justify-between gap-6'>
						<span className='text-grayscale'>Улица</span>
						<span className='text-end font-medium'>{EMPTY_VALUE}</span>
					</p>
					<p className='flex justify-between gap-6'>
						<span className='text-grayscale'>Дата</span>
						<span className='text-end font-medium'>{formatDateValue(offer?.delivery_date, 'dd/MM/yyyy', EMPTY_VALUE)}</span>
					</p>
				</div>

				<div className='space-y-4'>
					<p className='text-brand font-semibold'>Детали поездки</p>
					<p className='flex justify-between gap-6'>
						<span className='text-grayscale'>Общий путь</span>
						<span className='text-end font-medium'>
							{offer?.route_km ? `${offer.route_km} км` : EMPTY_VALUE}
						</span>
					</p>
					<p className='flex justify-between gap-6'>
						<span className='text-grayscale'>Время поездки</span>
						<span className='text-end font-medium'>{EMPTY_VALUE}</span>
					</p>
				</div>
			</div>

			<div className='h-px w-full bg-grayscale/60' />

			<div className='grid gap-10 lg:grid-cols-3'>
				<div className='space-y-4'>
					<p className='text-brand font-semibold'>Финансы</p>
					<p className='flex justify-between gap-6'>
						<span className='text-grayscale'>Способ оплаты</span>
						<span className='text-end font-medium'>
							{offer?.payment_method_display ?? EMPTY_VALUE}
						</span>
					</p>
					<p className='flex justify-between gap-6'>
						<span className='text-error-500'>Водитель</span>
						<span className='text-end font-medium text-error-500'>{EMPTY_VALUE}</span>
					</p>
					<p className='flex justify-between gap-6'>
						<span className='text-success-500'>Заказчик</span>
						<span className='text-end font-medium text-success-500'>
							{offer?.price_value
								? formatPriceValue(offer.price_value, offer.price_currency as PriceCurrencyCode)
								: EMPTY_VALUE}
						</span>
					</p>
				</div>
			</div>

			<div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
				<Checkbox id='agreement-terms' checked={isTermsChecked} onCheckedChange={(value) => setIsTermsChecked(Boolean(value))} />
				<label htmlFor='agreement-terms' className='cursor-pointer'>
					Я ознакомился и соглашаюсь с{' '}
					<Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
						<DialogTrigger asChild>
							<button type='button' className='text-brand underline-offset-4 hover:underline'>
								условиями пользования
							</button>
						</DialogTrigger>
						<DialogContent className='max-w-3xl'>
							<DialogHeader>
								<DialogTitle className='text-center text-2xl font-semibold'>Условия сотрудничества</DialogTitle>
							</DialogHeader>
							<div className='space-y-3 text-sm leading-relaxed text-foreground'>
								<p>
									В случае задержек, вызванных по вине Логиста, возможна компенсация простоя — если это было
									заранее оговорено.
								</p>
								<ol className='list-decimal space-y-2 pl-5'>
									<li>
										В случае задержек или повреждений по вине Водителя, Логист вправе пересмотреть сумму
										выплаты.
									</li>
									<li>
										Ответственность сторон
										<div className='mt-2 space-y-1'>
											<p>Логист несет ответственность за:</p>
											<ul className='list-disc pl-5 space-y-1'>
												<li>корректность предоставленной информации;</li>
												<li>своевременную оплату.</li>
											</ul>
											<p>Водитель несет ответственность за:</p>
											<ul className='list-disc pl-5 space-y-1'>
												<li>сохранность груза;</li>
												<li>соблюдение сроков;</li>
												<li>выполнение задания в соответствии с требованиями перевозки.</li>
											</ul>
										</div>
									</li>
									<li>
										Конфликтные ситуации
										<p className='mt-2'>
											Любые разногласия стороны обязуются решать путем прямого общения. Если договориться не
											получается, стороны вправе обратиться к третьей нейтральной стороне или действовать в
											соответствии с законодательством страны, где выполняется перевозка.
										</p>
									</li>
									<li>
										Отмена задания
										<div className='mt-2 space-y-1'>
											<p>Логист может отменить заказ до начала перевозки без штрафов.</p>
											<p>
												Если Водитель отменяет рейс после подтверждения, Логист вправе отказаться от
												дальнейшего сотрудничества или потребовать компенсацию, если была понесена реальная
												потеря.
											</p>
										</div>
									</li>
									<li>
										Форс-мажор
										<p className='mt-2'>
											Стороны освобождаются от ответственности за события, на которые невозможно повлиять:
											аварии, стихийные бедствия, блокировки дорог, технические поломки, не зависящие от
											Водителя, и другие обстоятельства непреодолимой силы.
										</p>
									</li>
									<li>
										Заключительные положения
										<p className='mt-2'>
											Принятие задания означает, что обе стороны согласны с настоящими условиями. Условия
											могут быть обновлены по взаимному согласию.
										</p>
									</li>
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
				<div className={agreement.accepted_by_logistic ? 'flex items-center gap-2 text-success-500' : 'flex items-center gap-2 text-error-500'}>
					<CheckCircle2 className='size-4' aria-hidden />
					<span>
						{agreement.accepted_by_logistic
							? 'Посредник принял условия пользования'
							: 'Посредник еще не принял условия пользования'}
					</span>
				</div>
				<div className={agreement.accepted_by_carrier ? 'flex items-center gap-2 text-success-500' : 'flex items-center gap-2 text-error-500'}>
					<Truck className='size-4' aria-hidden />
					<span>
						{agreement.accepted_by_carrier
							? 'Водитель принял условия пользования'
							: 'Водитель еще не принял условия пользования'}
					</span>
				</div>
			</div>

			<div className='flex flex-wrap items-center justify-end gap-3'>
				<Button
					variant='destructive'
					onClick={handleReject}
					disabled={isProcessing}
					className='min-w-[160px]'
				>
					{isLoadingRejectAgreement ? 'Отклонение...' : 'Отказать'}
				</Button>
				<Button
					onClick={handleAccept}
					disabled={isProcessing || !isTermsChecked}
					className={
						isTermsChecked
							? 'min-w-[160px] bg-success-500 text-white hover:bg-success-600'
							: 'min-w-[160px] bg-[#9CA3AF] text-white hover:bg-[#6B7280]'
					}
				>
					{isLoadingAcceptAgreement ? 'Принятие...' : 'Принять'}
				</Button>
			</div>
		</div>
	)
}
