'use client'

import { formatDateValue, formatDurationFromMinutes, formatPlace, formatPriceValue } from '@/lib/formatters'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import DOMPurify from 'dompurify'
import { Star } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '../Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../Dialog'
import { UuidCopy } from '../actions/UuidCopy'

type Props = {
	cargo: ICargoList
}

type DetailRowProps = {
	label: string
	value: ReactNode
}

const EMPTY_VALUE = '-'

const paymentMethodLabels: Record<string, string> = {
	transfer: 'Перечисление',
	cash: 'Наличные',
	both: 'Наличные / Перечисление',
}

const DetailRow = ({ label, value }: DetailRowProps) => (
	<div className='flex items-start justify-between gap-3 text-sm leading-relaxed'>
		<span className='text-muted-foreground'>{label}:</span>
		<span className='text-right font-semibold text-foreground'>{value}</span>
	</div>
)

const DetailSection = ({ title, children }: { title: string; children: ReactNode }) => (
	<div className='space-y-3'>
		<p className='text-base font-semibold text-brand'>{title}</p>
		<div className='space-y-2'>{children}</div>
	</div>
)

export function AnnouncementDetailModal({ cargo }: Props) {
	const transportName = getTransportName(cargo.transport_type) || cargo.transport_type || EMPTY_VALUE
	const canShowPhone = cargo.contact_pref === 'phone' || cargo.contact_pref === 'both'
	const canShowEmail = cargo.contact_pref === 'email' || cargo.contact_pref === 'both'
	const phone = canShowPhone ? cargo.phone || EMPTY_VALUE : EMPTY_VALUE
	const email = canShowEmail ? cargo.email || EMPTY_VALUE : EMPTY_VALUE
	const rating =
		Number.isFinite(cargo.company_rating) && cargo.company_rating > 0
			? cargo.company_rating.toFixed(1)
			: EMPTY_VALUE
	const paymentMethod =
		paymentMethodLabels[(cargo as ICargoList & { payment_method?: string }).payment_method ?? ''] ||
		(cargo as ICargoList & { payment_method?: string }).payment_method ||
		EMPTY_VALUE
	const formattedPrice = formatPriceValue(cargo.price_value, cargo.price_currency)
	const sanitizedDescription = cargo.description ? DOMPurify.sanitize(cargo.description) : ''

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline' className='flex-1 min-w-[140px] max-sm:w-full'>
					Подробнее
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader className='border-b pb-5'>
					<div className='flex flex-col items-center gap-3 md:flex-row justify-center'>
						<div className='md:absolute left-6'>
							<UuidCopy uuid={cargo.uuid} id={cargo.id} isPlaceholder />
						</div>
						<DialogTitle className='text-2xl text-center'>
							Подробнее
						</DialogTitle>
					</div>
				</DialogHeader>

				<div className='grid gap-10 pt-2 text-sm leading-6 md:grid-cols-2'>
					<div className='space-y-8'>
						<DetailSection title='Информация о пользователе'>
							<DetailRow label='Ф.И.О.' value={cargo.company_name || EMPTY_VALUE} />
							<DetailRow
								label='Рейтинг'
								value={
									<span className='inline-flex items-center gap-2 text-foreground'>
										<Star className='size-4 fill-yellow-500 text-yellow-500' aria-hidden />
										<span>{rating}</span>
									</span>
								}
							/>
							<DetailRow label='Телефон' value={phone} />
							<DetailRow label='Почта' value={email} />
						</DetailSection>

						<DetailSection title='Детали оборудования'>
							<DetailRow label='Наименование груза' value={cargo.product || EMPTY_VALUE} />
							<DetailRow label='Товар' value={cargo.product || EMPTY_VALUE} />
							<DetailRow label='Тип транспорта' value={transportName} />
							<DetailRow label='Кол-во осей' value={cargo.axles ?? EMPTY_VALUE} />
							<DetailRow label='Габариты (куб. м.)' value={cargo.volume_m3 ?? EMPTY_VALUE} />
						</DetailSection>


					</div>

					<div className='space-y-8'>
						<DetailSection title='Откуда'>
							<DetailRow
								label='Место'
								value={formatPlace(cargo.origin_city, cargo.origin_country, EMPTY_VALUE)}
							/>
							<DetailRow
								label='Дата отгрузки'
								value={formatDateValue(cargo.load_date, 'dd.MM.yyyy', EMPTY_VALUE)}
							/>
						</DetailSection>

						<DetailSection title='Куда'>
							<DetailRow
								label='Место'
								value={formatPlace(cargo.destination_city, cargo.destination_country, EMPTY_VALUE)}
							/>
							<DetailRow
								label='Дата разгрузки'
								value={formatDateValue(cargo.delivery_date, 'dd.MM.yyyy', EMPTY_VALUE)}
							/>
						</DetailSection>

						<DetailSection title='Детали перевозки'>
							<DetailRow label='Способ оплаты' value={paymentMethod} />
							<DetailRow label='Почта' value={email} />
							<DetailRow label='Номер телефона' value={phone} />
							<DetailRow label='Цена/Валюта' value={formattedPrice} />
						</DetailSection>
					</div>
				</div>
				<DetailSection title='Описание'>
					{sanitizedDescription ? (
						<div
							className='prose prose-sm max-w-none break-words whitespace-pre-wrap text-foreground'
							dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
						/>
					) : (
						<p className='text-foreground'>{EMPTY_VALUE}</p>
					)}
				</DetailSection>
			</DialogContent>
		</Dialog>
	)
}
