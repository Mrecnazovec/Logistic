'use client'

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { OfferModal } from '@/components/ui/modals/OfferModal'
import { ScrollArea, ScrollBar } from '@/components/ui/ScrollArea'
import { getContactPrefName } from '@/shared/enums/ContactPref.enum'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { formatCurrencyValue } from '@/shared/utils/currency'
import { useRoleStore } from '@/store/useRoleStore'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import DOMPurify from 'dompurify'
import { Star } from 'lucide-react'
import type { ReactNode } from 'react'

type InfoRowProps = {
	label: string
	value: ReactNode
}

const EMPTY_VALUE = '—'

const InfoRow = ({ label, value }: InfoRowProps) => (
	<div className='flex items-start justify-between gap-3 leading-relaxed'>
		<dt className='text-sm text-muted-foreground'>{label}:</dt>
		<dd className='text-right text-sm font-semibold text-foreground'>{value}</dd>
	</div>
)

const formatDate = (date?: string | null) =>
	date ? format(new Date(date), 'dd.MM.yyyy', { locale: ru }) : EMPTY_VALUE

const formatDurationFromMinutes = (totalMinutes?: number) => {
	if (!totalMinutes) return EMPTY_VALUE
	const hours = Math.floor(totalMinutes / 60)
	const minutes = totalMinutes % 60
	const parts = []
	if (hours) parts.push(`${hours} ч`)
	if (minutes) parts.push(`${minutes} мин`)
	return parts.length ? parts.join(' ') : `${totalMinutes} мин`
}

const formatAge = (ageMinutes?: number) => {
	if (!Number.isFinite(ageMinutes)) return EMPTY_VALUE
	if (!ageMinutes) return 'только что'
	if (ageMinutes < 60) return `${ageMinutes} мин назад`

	const hours = Math.floor(ageMinutes / 60)
	const minutes = ageMinutes % 60
	if (ageMinutes < 24 * 60) {
		if (minutes === 0) return `${hours} ч назад`
		return `${hours} ч ${minutes} мин назад`
	}

	const days = Math.floor(ageMinutes / (60 * 24))
	return `${days} дн. назад`
}

const formatCityCountry = (city?: string, country?: string) => {
	const location = [city, country].filter(Boolean).join(', ')
	return location || EMPTY_VALUE
}

export function ExpandedCargoRow({ cargo }: { cargo: ICargoList }) {
	const { role } = useRoleStore()

	const contactValue =
		cargo.contact_pref === 'email'
			? cargo.email
			: cargo.contact_pref === 'phone'
				? cargo.phone
				: cargo.phone || cargo.email || EMPTY_VALUE

	const transportName = getTransportName(cargo.transport_type) || cargo.transport_type || EMPTY_VALUE
	const contactName = getContactPrefName(cargo.contact_pref) || EMPTY_VALUE
	const ratingDisplay =
		Number.isFinite(cargo.company_rating) && cargo.company_rating > 0 ? cargo.company_rating.toFixed(1) : EMPTY_VALUE
	const formattedPrice = formatCurrencyValue(cargo.price_value, cargo.price_currency)
	const paymentMethodRaw = (cargo as ICargoList & { payment_method?: string }).payment_method
	const sanitizedDescription = cargo.description ? DOMPurify.sanitize(cargo.description) : ''

	const paymentMethod =
		paymentMethodRaw === 'transfer'
			? 'Перечисление'
			: paymentMethodRaw === 'cash'
				? 'Наличные'
				: paymentMethodRaw === 'both'
					? 'Наличные или перечисление'
					: paymentMethodRaw || EMPTY_VALUE

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<div className='flex items-center gap-3 text-sm text-muted-foreground'>
					<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground'>
						<span aria-hidden className='text-base font-semibold'>ID</span>
					</div>
					<UuidCopy uuid={cargo.uuid} id={cargo.id} isPlaceholder />
				</div>
				<p className='text-sm text-muted-foreground'>Опубликовано {formatAge(cargo.age_minutes)}</p>
			</div>

			<div className='grid grid-cols-1 gap-10 text-sm lg:grid-cols-4'>
				<div className='space-y-4'>
					<p className='text-base font-semibold text-brand'>Информация о пользователе</p>
					<dl className='space-y-2'>
						<InfoRow label='Ф.И.О.' value={cargo.company_name || EMPTY_VALUE} />
						<InfoRow label='Предпочтительный контакт' value={`${contactName}${contactValue ? `: ${contactValue}` : ''}`} />
						<InfoRow
							label='Рейтинг'
							value={
								<span className='inline-flex items-center gap-1 text-foreground'>
									<Star className='size-4 fill-yellow-500 text-yellow-500' aria-hidden />
									<span>{ratingDisplay}</span>
								</span>
							}
						/>
						<InfoRow label='Телефон' value={cargo.phone || EMPTY_VALUE} />
						<InfoRow label='Почта' value={cargo.email || EMPTY_VALUE} />
					</dl>
				</div>

				<div className='space-y-6'>
					<div className='space-y-2'>
						<p className='text-base font-semibold text-brand'>Откуда</p>
						<dl className='space-y-2'>
							<InfoRow label='Место' value={formatCityCountry(cargo.origin_city, cargo.origin_country)} />
							<InfoRow label='Дата отгрузки' value={formatDate(cargo.load_date)} />
						</dl>
					</div>
					<div className='space-y-2'>
						<p className='text-base font-semibold text-brand'>Куда</p>
						<dl className='space-y-2'>
							<InfoRow label='Место' value={formatCityCountry(cargo.destination_city, cargo.destination_country)} />
							<InfoRow label='Дата разгрузки' value={formatDate(cargo.delivery_date)} />
						</dl>
					</div>
				</div>

				<div className='space-y-4'>
					<p className='text-base font-semibold text-brand'>Детали оборудования</p>
					<dl className='space-y-2'>
						<InfoRow label='Наименование груза' value={cargo.product || EMPTY_VALUE} />
						<InfoRow label='Тип транспорта' value={transportName} />
						<InfoRow label='Кол-во осей' value={cargo.axles ?? EMPTY_VALUE} />
						<InfoRow label='Габариты (куб. м.)' value={cargo.volume_m3 ?? EMPTY_VALUE} />
					</dl>
				</div>

				<div className='space-y-4'>
					<p className='text-base font-semibold text-brand'>Детали перевозки</p>
					<dl className='space-y-2'>
						<InfoRow label='Способ оплаты' value={paymentMethod} />
						<InfoRow label='Почта' value={cargo.email || EMPTY_VALUE} />
						<InfoRow label='Номер телефона' value={cargo.phone || EMPTY_VALUE} />
						<InfoRow label='Примерное время' value={formatDurationFromMinutes(cargo.age_minutes)} />
						<InfoRow label='Цена/Валюта' value={formattedPrice} />
					</dl>
				</div>
			</div>

			<div className='space-y-2'>
				<p className='text-base font-semibold text-brand'>Описание</p>
				{sanitizedDescription ? (
					<div
						className='prose prose-sm max-w-none break-words whitespace-pre-wrap text-foreground prose-headings:mb-2 prose-p:mb-2'
						dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
					/>
				) : (
					<p className='text-sm text-foreground'>Описание не указано</p>
				)}
			</div>

			{role !== RoleEnum.CUSTOMER && (
				<div className='mt-2 flex justify-end'>
					<OfferModal selectedRow={cargo} title='Сделать предложение' />
				</div>
			)}
		</div>
	)
}
