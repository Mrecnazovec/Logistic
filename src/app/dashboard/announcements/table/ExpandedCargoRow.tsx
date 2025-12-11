'use client'

import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { OfferModal } from '@/components/ui/modals/OfferModal'
import {
	formatAgeFromMinutes,
	formatDateValue,
	formatDurationFromMinutes,
	formatPlace,
	formatPriceValue,
	formatRelativeDate,
} from '@/lib/formatters'
import { getContactPrefName } from '@/shared/enums/ContactPref.enum'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { useRoleStore } from '@/store/useRoleStore'
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
	const formattedPrice = formatPriceValue(cargo.price_value, cargo.price_currency)
	const paymentMethodRaw = (cargo as ICargoList & { payment_method?: string }).payment_method
	const sanitizedDescription = cargo.description ? DOMPurify.sanitize(cargo.description) : ''

	const paymentMethod =
		paymentMethodRaw === 'transfer'
			? 'Безналичный расчет'
			: paymentMethodRaw === 'cash'
				? 'Наличный расчет'
				: paymentMethodRaw === 'both'
					? 'Наличный или безналичный'
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
				<p className='text-sm text-muted-foreground'>Опубликовано {formatRelativeDate(cargo.created_at, EMPTY_VALUE)}</p>
			</div>

			<div className='grid grid-cols-1 gap-10 text-sm md:grid-cols-4'>
				<div className='space-y-4'>
					<p className='text-base font-semibold text-brand'>Информация о компании</p>
					<dl className='space-y-2'>
						<InfoRow label='Название' value={cargo.company_name || EMPTY_VALUE} />
						<InfoRow label='Представитель' value={<ProfileLink name={cargo.user_name} id={Number(cargo.user_id)} />} />
						<InfoRow
							label='Рейтинг'
							value={
								<span className='inline-flex items-center gap-1 text-foreground'>
									<Star className='size-4 fill-yellow-500 text-yellow-500' aria-hidden />
									<span>{ratingDisplay}</span>
								</span>
							}
						/>
						<InfoRow label='Телефон' value={cargo.contact_pref === 'both' || cargo.contact_pref === 'phone' ? cargo.phone : EMPTY_VALUE} />
						<InfoRow label='Email' value={cargo.contact_pref === 'both' || cargo.contact_pref === 'email' ? cargo.email : EMPTY_VALUE} />
					</dl>
				</div>

				<div className='space-y-6'>
					<div className='space-y-2'>
						<p className='text-base font-semibold text-brand'>Откуда</p>
						<dl className='space-y-2'>
							<InfoRow label='Город/страна' value={formatPlace(cargo.origin_city, cargo.origin_country, EMPTY_VALUE)} />
							<InfoRow label='Дата погрузки' value={formatDateValue(cargo.load_date, 'dd.MM.yyyy', EMPTY_VALUE)} />
						</dl>
					</div>
					<div className='space-y-2'>
						<p className='text-base font-semibold text-brand'>Куда</p>
						<dl className='space-y-2'>
							<InfoRow
								label='Город/страна'
								value={formatPlace(cargo.destination_city, cargo.destination_country, EMPTY_VALUE)}
							/>
							<InfoRow label='Дата выгрузки' value={formatDateValue(cargo.delivery_date, 'dd.MM.yyyy', EMPTY_VALUE)} />
						</dl>
					</div>
				</div>

				<div className='space-y-4'>
					<p className='text-base font-semibold text-brand'>Транспорт и параметры</p>
					<dl className='space-y-2'>
						<InfoRow label='Груз' value={cargo.product || EMPTY_VALUE} />
						<InfoRow label='Тип транспорта' value={transportName} />
						<InfoRow label='Количество осей' value={cargo.axles ?? EMPTY_VALUE} />
						<InfoRow label='Объем (м3)' value={cargo.volume_m3 ?? EMPTY_VALUE} />
					</dl>
				</div>

				<div className='space-y-4'>
					<p className='text-base font-semibold text-brand'>Оплата и связи</p>
					<dl className='space-y-2'>
						<InfoRow label='Способ оплаты' value={paymentMethod} />
						<InfoRow label='Email' value={cargo.email || EMPTY_VALUE} />
						<InfoRow label='Телефон' value={cargo.phone || EMPTY_VALUE} />
						<InfoRow label='Стоимость' value={formattedPrice} />
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
					<p className='text-sm text-foreground'>Описание не заполнено</p>
				)}
			</div>

			{role !== RoleEnum.CUSTOMER && (
				<div className='mt-2 flex lg:justify-center justify-start'>
					<OfferModal selectedRow={cargo} title='Подтвердить предложение' />
				</div>
			)}
		</div>
	)
}
