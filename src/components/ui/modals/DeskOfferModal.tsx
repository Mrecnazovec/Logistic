'use client'

import { ArrowRight, Link2 } from 'lucide-react'
import { useMemo, useState } from 'react'
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
import { useGenerateLoadInvite } from '@/hooks/queries/loads/useGenerateLoadInvite'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { formatCurrencyPerKmValue, formatCurrencyValue } from '@/shared/utils/currency'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface OfferModalProps {
	selectedRow?: ICargoList
	className?: string
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export function DeskOfferModal({ selectedRow, open, onOpenChange }: OfferModalProps) {
	const [shareCopyStatus, setShareCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')
	const { generateLoadInvite, invite, isLoadingGenerate, resetInvite } = useGenerateLoadInvite()

	const transportName = useMemo(
		() => (selectedRow ? getTransportName(selectedRow.transport_type) || '—' : null),
		[selectedRow],
	)
	const formattedPrice = formatCurrencyValue(selectedRow?.price_value, selectedRow?.price_currency)
	const formattedPricePerKm = formatCurrencyPerKmValue(selectedRow?.price_per_km, selectedRow?.price_currency)

	const shareLink = useMemo(() => {
		const token = invite?.token
		if (token) {
			return invite.invite_url
		}

		return invite?.invite_url ?? ''
	}, [invite?.invite_url, invite?.token])

	const handleModalOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			setShareCopyStatus('idle')
			resetInvite()
		}
		onOpenChange?.(isOpen)
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
					<DialogTitle className='text-center text-2xl font-bold'>
						Приглашение перевозчика
					</DialogTitle>
				</DialogHeader>

				{!selectedRow ? (
					<p className='py-6 text-center text-muted-foreground'>
						Ничего не выбрано. Выберите объявление в таблице, чтобы отправить приглашение.
					</p>
				) : (
					<div className='space-y-6'>
						<Card key={selectedRow.uuid} className='border-none bg-muted/40'>
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
										<p>{selectedRow.origin_dist_km} км</p>
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
									<p className='text-sm font-semibold text-foreground'>Приглашение по ссылке</p>
									<p className='text-sm text-muted-foreground'>
										Ссылка действует три дня и доступна только авторизованным перевозчикам. Отправьте её, чтобы перевозчик
										смог принять, отклонить или предложить свою цену на отдельной странице.
									</p>
									<InputGroup className='bg-background'>
										<InputGroupInput
											readOnly
											value={shareLink}
											placeholder='Сгенерируйте ссылку, чтобы поделиться объявлением'
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
												{shareLink ? 'Скопировать' : isLoadingGenerate ? 'Создание...' : 'Сгенерировать ссылку'}
												<Link2 className='size-4' />
											</Button>
										</InputGroupAddon>
									</InputGroup>
									{shareCopyStatus === 'copied' && (
										<p className='text-sm text-success-500'>Ссылка скопирована в буфер обмена.</p>
									)}
									{shareCopyStatus === 'error' && (
										<p className='text-sm text-error-500'>
											Не удалось скопировать ссылку. Попробуйте снова.
										</p>
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
