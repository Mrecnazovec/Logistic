'use client'

import { ArrowRight, Link2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/Dialog'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { DASHBOARD_URL } from '@/config/url.config'
import { useGenerateLoadInvite } from '@/hooks/queries/loads/useGenerateLoadInvite'
import { useInviteOffer } from '@/hooks/queries/offers/useAction/useInviteOffer'
import { formatCurrencyPerKmValue, formatCurrencyValue } from '@/lib/currency'
import { PaymentMethodEnum } from '@/shared/enums/PaymentMethod.enum'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface OfferModalProps {
	selectedRow?: ICargoList
	className?: string
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export function DeskInviteModal({ selectedRow, open, onOpenChange }: OfferModalProps) {
	const [shareCopyStatus, setShareCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')
	const [carrierId, setCarrierId] = useState('')
	const { generateLoadInvite, invite, isLoadingGenerate, resetInvite } = useGenerateLoadInvite()
	const { inviteOffer, isLoadingInvite } = useInviteOffer()

	const transportName = selectedRow ? getTransportName(selectedRow.transport_type) || '-' : null
	const formattedPrice = formatCurrencyValue(selectedRow?.price_value, selectedRow?.price_currency)
	const formattedPricePerKm = formatCurrencyPerKmValue(selectedRow?.price_per_km, selectedRow?.price_currency)
	const inviteToken = invite?.token

	const shareLink =
		inviteToken && typeof window !== 'undefined'
			? `${window.location.origin}${DASHBOARD_URL.desk(`invite/${inviteToken}`)}`
			: ''

	const handleModalOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			setShareCopyStatus('idle')
			resetInvite()
		}
		onOpenChange?.(isOpen)
	}

	const handleInviteCarrier = () => {
		if (!selectedRow?.id) {
			toast.error('Не найден груз для приглашения перевозчика.')
			return
		}

		const parsedCarrierId = Number(carrierId)
		if (!carrierId || Number.isNaN(parsedCarrierId)) {
			toast.error('Введите корректный ID перевозчика.')
			return
		}

		inviteOffer(
			{
				cargo: selectedRow.id,
				invited_user_id: parsedCarrierId,
				price_currency: selectedRow.price_currency ?? 'UZS',
				price_value: selectedRow.price_value ?? undefined,
				payment_method: (selectedRow as { payment_method?: PaymentMethodEnum }).payment_method ?? PaymentMethodEnum.CASH,
			},
			{
				onSuccess: () => setCarrierId(''),
			},
		)
	}

	const handleGenerateInviteLink = () => {
		if (!selectedRow?.uuid) {
			toast.error('Не удалось получить данные объявления.')
			return
		}

		generateLoadInvite(selectedRow.uuid)
	}

	const handleCopyShareLink = async () => {
		if (!shareLink) {
			toast.error('Сгенерируйте ссылку, чтобы её скопировать.')
			return
		}

		try {
			await navigator.clipboard.writeText(shareLink)
			setShareCopyStatus('copied')
			toast.success('Ссылка скопирована в буфер обмена.')
		} catch (error) {
			console.error(error)
			setShareCopyStatus('error')
			toast.error('Не удалось скопировать ссылку.')
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleModalOpenChange}>
			<DialogContent className='w-[900px] lg:max-w-none rounded-3xl'>
				<DialogHeader>
					<DialogTitle className='text-center text-2xl font-bold'>Приглашение перевозчика</DialogTitle>
				</DialogHeader>

				{!selectedRow ? (
					<p className='py-6 text-center text-muted-foreground'>
						Ничего не выбрано. Выберите объявление в таблице, чтобы отправить приглашение.
					</p>
				) : (
					<div className='space-y-6'>
						<Card key={selectedRow.uuid} className='border-none shadow-none'>
							<CardContent className='flex flex-col gap-6 pt-6'>
								<div className='flex flex-wrap items-center justify-between gap-6 border-b-2 pb-6'>
									<div>
										<p>
											{selectedRow.origin_city}, {selectedRow.origin_country}
										</p>
										<p>{format(selectedRow.load_date, 'dd.MM.yyyy', { locale: ru })}</p>
									</div>
									<div className='flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground'>
										<ArrowRight className='size-5' />
										<p>{selectedRow.route_km} км</p>
									</div>
									<div>
										<p>
											{selectedRow.destination_city}, {selectedRow.destination_country}
										</p>
										<p>
											{selectedRow.delivery_date
												? format(selectedRow.delivery_date, 'dd.MM.yyyy', { locale: ru })
												: '—'}
										</p>
									</div>
									<div className='text-sm text-muted-foreground'>
										<p>Тип транспорта: {transportName}</p>
										<p>Вес: {selectedRow.weight_t} т</p>
										<p>Стоимость: {formattedPrice}</p>
										<p>({formattedPricePerKm})</p>
									</div>
								</div>

								<div className='flex flex-wrap items-center justify-between gap-6 border-b-2 pb-6'>
									<p>
										<span className='font-semibold text-foreground'>Компания: </span>
										{selectedRow.company_name}
									</p>
									<p className='font-semibold text-foreground'>
										Предложение: {formattedPrice} ({formattedPricePerKm})
									</p>
								</div>

								<div className='flex flex-col gap-3 pt-2'>

									<div className='space-y-2'>
										<p className='text-sm font-semibold text-foreground'>Пригласить перевозчика по ID</p>
										<InputGroup>
											<InputGroupInput
												type='number'
												value={carrierId}
												onChange={(event) => setCarrierId(event.target.value)}
												placeholder='Введите ID перевозчика'
												className='pl-3'
											/>
											<InputGroupAddon align='inline-end'>
												<Button
													size='sm'
													variant='ghost'
													className='flex items-center gap-2'
													type='button'
													onClick={handleInviteCarrier}
													disabled={isLoadingInvite}
												>
													{isLoadingInvite ? 'Отправка...' : 'Пригласить'}
													<Link2 className='size-4' />
												</Button>
											</InputGroupAddon>
										</InputGroup>
									</div>
									<p className='text-sm font-semibold text-foreground'>Приглашение по ссылке</p>
									<p className='text-sm text-muted-foreground'>
										Ссылка ведёт на страницу оффера, где перевозчик сможет откликнуться на предложение.
										Сгенерируйте ссылку и отправьте её партнёру или скопируйте для быстрого доступа.
									</p>
									<InputGroup>
										<InputGroupInput
											readOnly
											value={shareLink}
											placeholder='Ссылка появится после генерации'
											className='pl-3'
										/>
										<InputGroupAddon align='inline-end'>
											<Button
												size='sm'
												variant='ghost'
												className='flex items-center gap-2'
												type='button'
												onClick={shareLink ? handleCopyShareLink : handleGenerateInviteLink}
												disabled={isLoadingGenerate}
											>
												{shareLink ? 'Скопировать ссылку' : isLoadingGenerate ? 'Создаём...' : 'Сгенерировать ссылку'}
												<Link2 className='size-4' />
											</Button>
										</InputGroupAddon>
									</InputGroup>
									{shareCopyStatus === 'copied' && (
										<p className='text-sm text-success-500'>Ссылка скопирована в буфер обмена.</p>
									)}
									{shareCopyStatus === 'error' && (
										<p className='text-sm text-error-500'>Не удалось скопировать ссылку.</p>
									)}
								</div>

								<div className='mt-2 flex max-md:flex-col md:justify-end gap-3'>
									<DialogClose asChild>
										<Button
											className='max-md:w-full bg-destructive text-white hover:bg-destructive/90'
											type='button'
										>
											Отменить
										</Button>
									</DialogClose>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}

