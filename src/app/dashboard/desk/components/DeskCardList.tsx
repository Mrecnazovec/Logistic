"use client"

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { DASHBOARD_URL } from '@/config/url.config'
import { useRefreshLoad } from '@/hooks/queries/loads/useRefreshLoad'
import { useToggleLoadVisibility } from '@/hooks/queries/loads/useToggleLoadVisibility'
import { useGetOffers } from '@/hooks/queries/offers/useGet/useGetOffers'
import { useI18n } from '@/i18n/I18nProvider'
import { formatDateValue, formatPlace, formatPricePerKmValue, formatPriceValue, formatWeightValue } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { CalendarDays, CircleCheck, Eye, EyeOff, Handshake, Mail, MapPin, Minus, Pen, Phone, RefreshCcw, Scale, Truck, Wallet } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'

const DeskInviteModal = dynamic(() => import('@/components/ui/modals/DeskInviteModal').then((mod) => mod.DeskInviteModal))
const DeskOffersModal = dynamic(() => import('@/components/ui/modals/DeskOffersModal/DeskOffersModal').then((mod) => mod.DeskOffersModal))

type DeskCardListProps = {
	cargos: ICargoList[]
	serverPagination?: ServerPaginationMeta
}

export function DeskCardList({ cargos, serverPagination }: DeskCardListProps) {
	const pagination = useCardPagination(serverPagination)
	if (!cargos.length) return null

	return (
		<CardListLayout
			items={cargos}
			getKey={(cargo) => cargo.uuid}
			renderItem={(cargo) => <DeskCard cargo={cargo} />}
			pagination={pagination}
		/>
	)
}

type DeskCardProps = {
	cargo: ICargoList
}

function DeskCard({ cargo }: DeskCardProps) {
	const { t } = useI18n()
	const transportName = getTransportName(t, cargo.transport_type) || cargo.transport_type || '-'
	const { toggleLoadVisibility, isLoadingToggle } = useToggleLoadVisibility()
	const { refreshLoad } = useRefreshLoad()
	const [offerOpen, setOfferOpen] = useState(false)
	const canShowPhone = cargo.contact_pref === 'phone' || cargo.contact_pref === 'both'
	const canShowEmail = cargo.contact_pref === 'email' || cargo.contact_pref === 'both'

	const isHidden = Boolean(cargo.is_hidden)
	const visibilityActionLabel = isHidden ? t('desk.card.show') : t('desk.card.hide')
	const VisibilityIcon = isHidden ? Eye : EyeOff

	const sections = [
		{
			title: t('desk.card.from'),
			items: [
				{ icon: MapPin, primary: formatPlace(cargo.origin_city, cargo.origin_country), secondary: t('desk.card.place') },
				{ icon: CalendarDays, primary: formatDateValue(cargo.load_date), secondary: t('desk.card.load') },
			],
		},
		{
			title: t('desk.card.to'),
			items: [
				{ icon: MapPin, primary: formatPlace(cargo.destination_city, cargo.destination_country), secondary: t('desk.card.place') },
				{ icon: CalendarDays, primary: formatDateValue(cargo.delivery_date), secondary: t('desk.card.unload') },
			],
		},
		{
			title: t('desk.card.transportWeight'),
			items: [
				{ icon: Truck, primary: transportName, secondary: t('desk.card.transportType') },
				{ icon: Scale, primary: formatWeightValue(cargo.weight_t), secondary: t('desk.card.weight') },
			],
		},
		{
			title: t('desk.card.price'),
			items: [
				{ icon: Wallet, primary: formatPriceValue(cargo.price_value, cargo.price_currency), secondary: t('desk.card.priceFixed') },
				{ icon: Wallet, primary: formatPricePerKmValue(cargo.price_per_km, cargo.price_currency), secondary: t('desk.card.pricePerKm') },
			],
		},
		{
			title: t('desk.card.contacts'),
			items: [
				{ icon: Phone, primary: canShowPhone ? cargo.phone : '-', secondary: t('desk.card.phone') },
				{ icon: Mail, primary: canShowEmail ? cargo.email : '-', secondary: t('desk.card.email') },
			],
		},

	]

	return (
		<Card className={cn('h-full rounded-3xl border-0 xs:bg-neutral-500', cargo.moderation_status === 'pending' && 'xs:bg-purple-50 bg-purple-50', cargo.moderation_status === 'rejected' && 'xs:bg-purple-50 bg-red-50', cargo.is_hidden && 'opacity-60')}>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>
						{cargo.company_name || cargo.product || t('desk.card.noTitle')}
					</CardTitle>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<span className='font-semibold text-foreground'>ID:</span>
						<UuidCopy uuid={cargo.uuid} />
					</div>
				</div>
				<p className='text-sm text-muted-foreground'>
					{t('desk.card.productLabel', { product: cargo.product ?? '-' })}
				</p>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />
				<section className='flex flex-col gap-2'>
					<span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{t('desk.card.offers')}</span>
					<HasOffersField cargo={cargo} />
				</section>
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Button
					variant='outline'
					className='min-w-[140px] flex-1 bg-[#111827] hover:bg-[#1e273ad3] text-white hover:text-white'
					onClick={() => refreshLoad({ uuid: cargo.uuid, detail: t('desk.card.refreshDetail') })}
				>
					<RefreshCcw /> {t('desk.card.refresh')}
				</Button>
				<Link className='min-w-[140px] flex-1' href={DASHBOARD_URL.edit(cargo.uuid)}>
					<Button variant='outline' className='w-full bg-warning-500 text-white hover:bg-warning-400 hover:text-white'>
						<Pen /> {t('desk.card.edit')}
					</Button>
				</Link>
				<Button
					variant='outline'
					className='min-w-[140px] flex-1 bg-error-500 text-white hover:bg-error-400 hover:text-white'
					onClick={() => toggleLoadVisibility({ uuid: cargo.uuid, isHidden: !isHidden })}
					disabled={isLoadingToggle}
				>
					<VisibilityIcon className='size-4' />
					{visibilityActionLabel}
				</Button>
				<Button
					variant='outline'
					onClick={() => setOfferOpen(true)}
					className='min-w-[240px] flex flex-1 items-center gap-2 bg-brand text-white hover:bg-brand/80 hover:text-white'
				>
					<Handshake className='size-4' />
					{t('desk.card.offer')}
				</Button>
			</CardFooter>

			<DeskInviteModal open={offerOpen} onOpenChange={setOfferOpen} selectedRow={cargo} />
		</Card>
	)
}

function HasOffersField({ cargo }: { cargo: ICargoList }) {
	const { t } = useI18n()
	const [open, setOpen] = useState(false)
	const { data, isLoading } = useGetOffers(
		cargo.uuid ? { cargo_uuid: cargo.uuid } : undefined,
		{ enabled: Boolean(cargo.uuid) }
	)
	const hasOffers = (data?.results?.length ?? 0) > 0

	return (
		<>
			<Button
				type='button'
				variant='outline'
				className='flex items-center gap-2 border-0 p-0 text-sm font-semibold text-foreground shadow-none disabled:text-muted-foreground'
				onClick={() => setOpen(true)}
				disabled={isLoading || !hasOffers}
			>
				{hasOffers ? (
					<>
						<CircleCheck className='size-4 text-success-500' aria-hidden />
						<span>{t('desk.card.hasOffers')}</span>
					</>
				) : (
					<>
						<Minus className='size-4 text-muted-foreground' aria-hidden />
						<span>{t('desk.card.noOffers')}</span>
					</>
				)}
			</Button>

			<DeskOffersModal cargoUuid={cargo.uuid} open={open} onOpenChange={setOpen} />
		</>
	)
}
