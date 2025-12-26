"use client"

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { DASHBOARD_URL } from '@/config/url.config'
import { useI18n } from '@/i18n/I18nProvider'
import { formatDateValue, formatPlace, formatPricePerKmValue, formatPriceValue, formatWeightValue } from '@/lib/formatters'
import { getTransportName, type TransportTypeEnum } from '@/shared/enums/TransportType.enum'
import { IOfferShort } from '@/shared/types/Offer.interface'
import { CalendarDays, CircleCheck, EyeOff, Handshake, MapPin, Minus, Pen, RefreshCcw, Scale, Truck, Wallet } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'

const DeskOffersModal = dynamic(() => import('@/components/ui/modals/DeskOffersModal/DeskOffersModal').then((mod) => mod.DeskOffersModal))

type DeskCardListProps = {
	cargos: IOfferShort[]
	serverPagination?: ServerPaginationMeta
}

export function DeskCardDriverList({ cargos, serverPagination }: DeskCardListProps) {
	const pagination = useCardPagination(serverPagination)
	if (!cargos.length) return null

	return (
		<CardListLayout
			items={cargos}
			getKey={(cargo) => cargo.id}
			renderItem={(cargo) => <DeskCard cargo={cargo} />}
			pagination={pagination}
		/>
	)
}

type DeskCardProps = {
	cargo: IOfferShort
}

function DeskCard({ cargo }: DeskCardProps) {
	const { t } = useI18n()
	const transportName = getTransportName(t, cargo.transport_type as TransportTypeEnum) || cargo.transport_type || '-'
	const sections = [
		{
			title: t('desk.driver.originTitle'),
			items: [
				{ icon: MapPin, primary: formatPlace(cargo.origin_city, cargo.origin_country), secondary: t('desk.card.place') },
				{ icon: CalendarDays, primary: formatDateValue(cargo.load_date), secondary: t('desk.card.load') },
			],
		},
		{
			title: t('desk.driver.destinationTitle'),
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
				{ icon: Wallet, primary: formatPriceValue(cargo.price_value, cargo.price_currency), secondary: t('desk.driver.payment') },
				{ icon: Wallet, primary: formatPricePerKmValue(cargo.price_per_km, cargo.price_currency), secondary: t('desk.card.pricePerKm') },
			],
		},
	]

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>{t('desk.driver.title')}</CardTitle>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<span className='font-semibold text-foreground'>ID:</span>
						<UuidCopy uuid={cargo.cargo_uuid} />
					</div>
				</div>
				<p className='text-sm text-muted-foreground'>{t('desk.driver.requestLabel')}</p>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />
				<section className='flex flex-col gap-2'>
					<span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{t('desk.card.offers')}</span>
					<HasOffersField cargo={cargo} />
				</section>
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Button variant='outline' className='min-w-[140px] flex-1 bg-[#111827] text-white'>
					<RefreshCcw /> {t('desk.driver.refresh')}
				</Button>
				<Link className='min-w-[140px] flex-1' href={DASHBOARD_URL.edit(String(cargo.cargo_uuid))}>
					<Button variant='outline' className='w-full bg-warning-400 text-white'>
						<Pen /> {t('desk.driver.edit')}
					</Button>
				</Link>
				<Button variant='outline' className='min-w-[140px] flex-1 bg-error-500 text-white'>
					<EyeOff /> {t('desk.driver.hide')}
				</Button>
				<Button variant='outline' className='min-w-[240px] flex flex-1 items-center gap-2 bg-brand text-white'>
					<Handshake className='size-4' />
					{t('desk.driver.offer')}
				</Button>
			</CardFooter>
		</Card>
	)
}

function HasOffersField({ cargo }: { cargo: IOfferShort }) {
	const { t } = useI18n()
	const hasOffers = Boolean(cargo.accepted_by_carrier)
	const [open, setOpen] = useState(false)

	return (
		<>
			<Button
				type='button'
				variant='outline'
				className='flex items-center gap-2 border-0 p-0 text-sm font-semibold text-foreground shadow-none disabled:text-muted-foreground'
				onClick={() => setOpen(true)}
				disabled={!hasOffers}
			>
				{hasOffers ? (
					<>
						<CircleCheck className='size-4 text-success-500' aria-hidden />
						<span>{t('desk.driver.hasOffers')}</span>
					</>
				) : (
					<>
						<Minus className='size-4 text-muted-foreground' aria-hidden />
						<span>{t('desk.driver.noOffers')}</span>
					</>
				)}
			</Button>

			<DeskOffersModal cargoUuid={cargo.cargo_uuid} open={open} onOpenChange={setOpen} />
		</>
	)
}
