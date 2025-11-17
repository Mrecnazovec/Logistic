'use client'

import { OfferModal } from '@/components/ui/modals/OfferModal'
import { getContactPrefName } from '@/shared/enums/ContactPref.enum'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { formatCurrencyValue } from '@/shared/utils/currency'
import { useRoleStore } from '@/store/useRoleStore'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Star } from 'lucide-react'
import type { ReactNode } from 'react'

type InfoRowProps = {
	label: string
	value: ReactNode
}

const InfoRow = ({ label, value }: InfoRowProps) => (
	<div className='flex items-start justify-between gap-4'>
		<dt className='text-muted-foreground'>{label}:</dt>
		<dd className='text-right font-semibold text-foreground'>{value}</dd>
	</div>
)

const formatDate = (date?: string | null) =>
	date ? format(new Date(date), 'dd.MM.yyyy', { locale: ru }) : '—'

const formatDurationFromMinutes = (totalMinutes?: number) => {
	if (!totalMinutes) return '—'
	const hours = Math.floor(totalMinutes / 60)
	const minutes = totalMinutes % 60
	const parts = []
	if (hours) parts.push(`${hours} ч`)
	if (minutes) parts.push(`${minutes} мин`)
	return parts.join(' ')
}

export function ExpandedCargoRow({ cargo }: { cargo: ICargoList }) {
	const { role } = useRoleStore()

	const contactValue =
		cargo.contact_pref === 'email'
			? cargo.email
			: cargo.contact_pref === 'phone'
				? cargo.phone
				: cargo.phone || cargo.email || '—'

	const transportName = getTransportName(cargo.transport_type) || cargo.transport_type
	const contactName = getContactPrefName(cargo.contact_pref) || '—'
	const ratingDisplay =
		Number.isFinite(cargo.company_rating) && cargo.company_rating > 0 ? cargo.company_rating.toFixed(1) : '—'
	const formattedPrice = formatCurrencyValue(cargo.price_value, cargo.price_currency)

	return (
		<div className='flex flex-col gap-6'>
			<div className='grid grid-cols-1 gap-10 text-sm md:grid-cols-4'>
				<div className='space-y-4'>
					<p className='font-semibold text-brand'>Информация о пользователе</p>
					<dl className='space-y-3'>
						<InfoRow label='Логин' value={cargo.company_name || '—'} />
						<InfoRow label='Способ связи' value={`${contactName}${contactValue ? `: ${contactValue}` : ''}`} />
						<InfoRow
							label='Рейтинг'
							value={
								<span className='inline-flex items-center gap-1'>
									<Star className='size-4 fill-yellow-500 text-yellow-500' aria-hidden />
									<span>{ratingDisplay}</span>
								</span>
							}
						/>
					</dl>
				</div>

				<div className='space-y-6'>
					<div className='space-y-3'>
						<p className='font-semibold text-brand'>Откуда</p>
						<dl className='space-y-3'>
							<InfoRow label='Место' value={`${cargo.origin_city}, ${cargo.origin_country}`} />
							<InfoRow label='Дата отгрузки' value={formatDate(cargo.load_date)} />
						</dl>
					</div>
					<div className='space-y-3'>
						<p className='font-semibold text-brand'>Куда</p>
						<dl className='space-y-3'>
							<InfoRow label='Место' value={`${cargo.destination_city}, ${cargo.destination_country}`} />
							<InfoRow label='Дата разгрузки' value={formatDate(cargo.delivery_date)} />
						</dl>
					</div>
				</div>

				<div className='space-y-4'>
					<p className='font-semibold text-brand'>Детали оборудования</p>
					<dl className='space-y-3'>
						<InfoRow label='Наименование груза' value={cargo.product || '—'} />
						<InfoRow label='Тип транспорта' value={transportName} />
					</dl>
				</div>

				<div className='space-y-4'>
					<p className='font-semibold text-brand'>Детали перевозки</p>
					<dl className='space-y-3'>
						<InfoRow label='Способ оплаты' value='—' />
						<InfoRow label='Почта' value={cargo.email || '—'} />
						<InfoRow label='Номер телефона' value={cargo.phone || '—'} />
						<InfoRow label='Примерное время' value={formatDurationFromMinutes(cargo.age_minutes)} />
						<InfoRow label='Цена/Валюта' value={formattedPrice} />
						<InfoRow label='Наименование груза' value={cargo.product || '—'} />
					</dl>
				</div>
			</div>

			{role !== RoleEnum.CUSTOMER && (
				<div className='mt-6 flex justify-end'>
					<OfferModal selectedRow={cargo} />
				</div>
			)}
		</div>
	)
}
