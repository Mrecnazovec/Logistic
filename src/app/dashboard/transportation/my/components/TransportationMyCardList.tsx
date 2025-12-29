'use client'

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections, type CardSection } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { DASHBOARD_URL } from '@/config/url.config'
import { useI18n } from '@/i18n/I18nProvider'
import { formatDateValue, formatPricePerKmValue, formatPriceValue } from '@/lib/formatters'
import type { IOrderList } from '@/shared/types/Order.interface'
import { Building2, CalendarDays, Home, MapPin, Wallet } from 'lucide-react'
import Link from 'next/link'

type TransportationMyCardListProps = {
	cargos: IOrderList[]
	serverPagination?: ServerPaginationMeta
	statusValue: string
}

export function TransportationMyCardList({ cargos, serverPagination, statusValue }: TransportationMyCardListProps) {
	const pagination = useCardPagination(serverPagination)

	if (!cargos.length) {
		return null
	}

	return (
		<CardListLayout
			items={cargos}
			getKey={(cargo) => cargo.id}
			renderItem={(cargo) => <TransportationMyCard cargo={cargo} statusValue={statusValue} />}
			pagination={pagination}
		/>
	)
}

type TransportationMyCardProps = {
	cargo: IOrderList
	statusValue: string
}

function TransportationMyCard({ cargo }: TransportationMyCardProps) {
	const { t } = useI18n()
	const placeholder = t('transportation.card.placeholder')
	const addressMissing = t('transportation.card.addressMissing')
	const sections: CardSection[] = [
		{
			title: t('transportation.card.section.customerCarrier'),
			items: [
				{ icon: Building2, primary: cargo.customer_name || placeholder, secondary: t('transportation.card.label.customer') },
				{ icon: Building2, primary: cargo.carrier_name || placeholder, secondary: t('transportation.card.label.carrier') },
			],
		},
		{
			title: t('transportation.card.section.origin'),
			items: [
				{ icon: MapPin, primary: cargo.origin_city || placeholder, secondary: t('transportation.card.label.city') },
				{ icon: Home, primary: addressMissing, secondary: t('transportation.card.label.address') },
			],
		},
		{
			title: t('transportation.card.section.destination'),
			items: [
				{ icon: MapPin, primary: cargo.destination_city || placeholder, secondary: t('transportation.card.label.city') },
				{ icon: Home, primary: addressMissing, secondary: t('transportation.card.label.address') },
			],
		},
		{
			title: t('transportation.card.section.when'),
			items: [
				{ icon: CalendarDays, primary: formatDateValue(cargo.load_date), secondary: t('transportation.card.label.load') },
				{ icon: CalendarDays, primary: formatDateValue(cargo.delivery_date), secondary: t('transportation.card.label.delivery') },
			],
		},
		{
			title: t('transportation.card.section.price'),
			items: [
				{ icon: Wallet, primary: formatPricePerKmValue(cargo.price_per_km, cargo.currency), secondary: t('transportation.card.label.pricePerKm') },
				{ icon: Wallet, primary: formatPriceValue(cargo.price_total, cargo.currency), secondary: t('transportation.card.label.totalPrice') },
			],
		},
	]

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<UuidCopy id={cargo.id} isPlaceholder />
					</div>
					<span className='ml-auto text-xs text-muted-foreground'>
						{t('transportation.card.docsCount', { count: cargo.documents_count ?? 0 })}
					</span>
				</div>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Link className='flex-1 min-w-[140px]' href={DASHBOARD_URL.order(String(cargo.id))}>
					<Button className='w-full bg-warning-400 hover:bg-warning-500 text-white'>{t('transportation.card.view')}</Button>
				</Link>
			</CardFooter>
		</Card>
	)
}
