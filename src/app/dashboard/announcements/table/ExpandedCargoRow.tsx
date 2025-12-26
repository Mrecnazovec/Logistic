'use client'

import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { OfferModal } from '@/components/ui/modals/OfferModal'
import { formatDateValue, formatPlace, formatPriceValue, formatRelativeDate } from '@/lib/formatters'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { useRoleStore } from '@/store/useRoleStore'
import { useI18n } from '@/i18n/I18nProvider'
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
	const { t } = useI18n()
	const { role } = useRoleStore()

	const transportName = getTransportName(t, cargo.transport_type) || cargo.transport_type || EMPTY_VALUE
	const ratingDisplay =
		Number.isFinite(cargo.company_rating) && cargo.company_rating > 0 ? cargo.company_rating.toFixed(1) : EMPTY_VALUE
	const formattedPrice = formatPriceValue(cargo.price_value, cargo.price_currency)
	const paymentMethodRaw = (cargo as ICargoList & { payment_method?: string }).payment_method
	const sanitizedDescription = cargo.description ? DOMPurify.sanitize(cargo.description) : ''

	const paymentMethod =
		paymentMethodRaw === 'cashless'
			? t('announcements.expanded.payment.cashless')
			: paymentMethodRaw === 'cash'
				? t('announcements.expanded.payment.cash')
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
				<p className='text-sm text-muted-foreground'>
					{t('announcements.expanded.published', { date: formatRelativeDate(cargo.created_at, EMPTY_VALUE) })}
				</p>
			</div>

			<div className='grid grid-cols-1 gap-10 text-sm md:grid-cols-4'>
				<div className='space-y-4'>
					<p className='text-base font-semibold text-brand'>{t('announcements.expanded.company.title')}</p>
					<dl className='space-y-2'>
						<InfoRow label={t('announcements.expanded.label.name')} value={cargo.company_name || EMPTY_VALUE} />
						<InfoRow
							label={t('announcements.expanded.label.representative')}
							value={<ProfileLink name={cargo.user_name} id={Number(cargo.user_id)} />}
						/>
						<InfoRow
							label={t('announcements.expanded.label.rating')}
							value={
								<span className='inline-flex items-center gap-1 text-foreground'>
									<Star className='size-4 fill-yellow-500 text-yellow-500' aria-hidden />
									<span>{ratingDisplay}</span>
								</span>
							}
						/>
						<InfoRow
							label={t('announcements.expanded.label.phone')}
							value={cargo.contact_pref === 'both' || cargo.contact_pref === 'phone' ? cargo.phone : EMPTY_VALUE}
						/>
						<InfoRow
							label={t('announcements.expanded.label.email')}
							value={cargo.contact_pref === 'both' || cargo.contact_pref === 'email' ? cargo.email : EMPTY_VALUE}
						/>
					</dl>
				</div>

				<div className='space-y-6'>
					<div className='space-y-2'>
						<p className='text-base font-semibold text-brand'>{t('announcements.expanded.origin.title')}</p>
						<dl className='space-y-2'>
							<InfoRow
								label={t('announcements.expanded.origin.place')}
								value={formatPlace(cargo.origin_city, cargo.origin_country, EMPTY_VALUE)}
							/>
							<InfoRow
								label={t('announcements.expanded.origin.loadDate')}
								value={formatDateValue(cargo.load_date, 'dd.MM.yyyy', EMPTY_VALUE)}
							/>
						</dl>
					</div>
					<div className='space-y-2'>
						<p className='text-base font-semibold text-brand'>{t('announcements.expanded.destination.title')}</p>
						<dl className='space-y-2'>
							<InfoRow
								label={t('announcements.expanded.destination.place')}
								value={formatPlace(cargo.destination_city, cargo.destination_country, EMPTY_VALUE)}
							/>
							<InfoRow
								label={t('announcements.expanded.destination.unloadDate')}
								value={formatDateValue(cargo.delivery_date, 'dd.MM.yyyy', EMPTY_VALUE)}
							/>
						</dl>
					</div>
				</div>

				<div className='space-y-4'>
					<p className='text-base font-semibold text-brand'>{t('announcements.expanded.transport.title')}</p>
					<dl className='space-y-2'>
						<InfoRow label={t('announcements.expanded.transport.cargo')} value={cargo.product || EMPTY_VALUE} />
						<InfoRow label={t('announcements.expanded.transport.type')} value={transportName} />
						<InfoRow label={t('announcements.expanded.transport.axles')} value={cargo.axles ?? EMPTY_VALUE} />
						<InfoRow label={t('announcements.expanded.transport.volume')} value={cargo.volume_m3 ?? EMPTY_VALUE} />
					</dl>
				</div>

				<div className='space-y-4'>
					<p className='text-base font-semibold text-brand'>{t('announcements.expanded.payment.title')}</p>
					<dl className='space-y-2'>
						<InfoRow label={t('announcements.expanded.payment.method')} value={paymentMethod} />
						<InfoRow label={t('announcements.expanded.label.email')} value={cargo.email || EMPTY_VALUE} />
						<InfoRow label={t('announcements.expanded.label.phone')} value={cargo.phone || EMPTY_VALUE} />
						<InfoRow label={t('announcements.expanded.payment.price')} value={formattedPrice} />
					</dl>
				</div>
			</div>

			<div className='space-y-2'>
				<p className='text-base font-semibold text-brand'>{t('announcements.expanded.description.title')}</p>
				{sanitizedDescription ? (
					<div
						className='prose prose-sm max-w-none break-words whitespace-pre-wrap text-foreground prose-headings:mb-2 prose-p:mb-2'
						dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
					/>
				) : (
					<p className='text-sm text-foreground'>{t('announcements.expanded.description.empty')}</p>
				)}
			</div>

			{role !== RoleEnum.CUSTOMER && (
				<div className='mt-2 flex justify-start lg:justify-center'>
					<OfferModal selectedRow={cargo} title={t('announcements.expanded.offer')} />
				</div>
			)}
		</div>
	)
}
