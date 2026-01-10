"use client"

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections, type CardSection } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { useI18n } from '@/i18n/I18nProvider'
import {
	DEFAULT_PLACEHOLDER,
	formatPlace,
	formatPriceValue,
	formatRelativeDate
} from '@/lib/formatters'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { Mail, MapPin, Minus, Phone, Star, Wallet } from 'lucide-react'
import dynamic from 'next/dynamic'

const AnnouncementDetailModal = dynamic(() =>
	import('@/components/ui/modals/AnnouncementDetailModal').then((mod) => mod.AnnouncementDetailModal),
)
const OfferModal = dynamic(() => import('@/components/ui/modals/OfferModal').then((mod) => mod.OfferModal))

type AnnouncementsCardListProps = {
	cargos: ICargoList[]
	serverPagination?: ServerPaginationMeta
}

export function AnnouncementsCardList({ cargos, serverPagination }: AnnouncementsCardListProps) {
	const pagination = useCardPagination(serverPagination)

	if (!cargos.length) {
		return null
	}

	return (
		<CardListLayout
			items={cargos}
			getKey={(cargo) => cargo.uuid}
			renderItem={(cargo) => <AnnouncementCard cargo={cargo} />}
			pagination={pagination}
		/>
	)
}

type AnnouncementCardProps = {
	cargo: ICargoList
}

function AnnouncementCard({ cargo }: AnnouncementCardProps) {
	const { t, locale } = useI18n()
	const transportName = getTransportName(t, cargo.transport_type) || cargo.transport_type || '-'
	const canShowPhone = cargo.contact_pref === 'phone' || cargo.contact_pref === 'both'
	const canShowEmail = cargo.contact_pref === 'email' || cargo.contact_pref === 'both'

	const sections: CardSection[] = [
		{
			title: t('announcements.card.from'),
			items: [
				{
					icon: MapPin,
					primary: formatPlace(cargo.origin_city, cargo.origin_country),
					secondary: t('announcements.card.place'),
				},
			],
		},
		{
			title: t('announcements.card.to'),
			items: [
				{
					icon: MapPin,
					primary: formatPlace(cargo.destination_city, cargo.destination_country),
					secondary: t('announcements.card.place'),
				},

			],
		},
		{
			title: t('announcements.card.priceKm'),
			items: [
				{
					icon: Wallet,
					primary: formatPriceValue(cargo.price_value, cargo.price_currency),
					secondary: t('announcements.card.price'),
				},
			],
		},
		{
			title: t('announcements.card.phone'),
			items: [{ icon: Phone, primary: canShowPhone ? cargo.phone : '-' }],
		},
		{
			title: t('announcements.card.email'),
			items: [{ icon: Mail, primary: canShowEmail ? cargo.email : '-' }],
		},
	]

	return (
		<Card className='rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b [.border-b]:pb-0'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<span className='flex items-center text-sm text-muted-foreground'>
						<Star className='text-warning-500 fill-warning-500' /> {cargo.company_rating ? cargo.company_rating.toFixed(1) : <Minus />}
					</span>
					<CardTitle className='text-lg font-semibold leading-tight text-grayscale'>
						{cargo.company_name || '—'}
					</CardTitle>
					<span className='text-lg font-semibold leading-tight text-grayscale'>
						{formatRelativeDate(cargo.created_at, DEFAULT_PLACEHOLDER, locale)}
					</span>
				</div>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />
			</CardContent>

			<CardFooter className='flex flex-wrap max-sm:flex-col gap-3 border-t pt-4'>
				<AnnouncementDetailModal cargo={cargo} />
				<OfferModal className='min-w-[140px] flex-1 max-sm:w-full' title={t('announcements.card.offer')} selectedRow={cargo} />
			</CardFooter>
		</Card>
	)
}
