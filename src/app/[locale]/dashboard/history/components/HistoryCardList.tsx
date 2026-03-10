"use client"

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections, type CardSection } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { useI18n } from '@/i18n/I18nProvider'
import { formatDateValue, formatDistanceKm, formatPricePerKmValue, formatPriceValue } from '@/lib/formatters'
import { RoleEnum } from '@/shared/enums/Role.enum'
import type { IOrderList } from '@/shared/types/Order.interface'
import { Building2, CalendarDays, FileText, MapPin, Route as RouteIcon, Star, Wallet } from 'lucide-react'
import { getOrderStatusLabel, getOrderStatusVariant } from '../orderStatusConfig'
import { getRatingsForRole } from '../table/HistoryColumns'

type HistoryCardListProps = {
	orders: IOrderList[]
	serverPagination?: ServerPaginationMeta
	onView?: (order: IOrderList) => void
	role?: RoleEnum | null
}

export function HistoryCardList({ orders, serverPagination, onView, role }: HistoryCardListProps) {
	const pagination = useCardPagination(serverPagination)
	if (!orders.length) return null

	return (
		<CardListLayout
			items={orders}
			getKey={(order) => order.id}
			renderItem={(order) => <HistoryCard order={order} onView={onView} role={role} />}
			pagination={pagination}
		/>
	)
}

type HistoryCardProps = {
	order: IOrderList
	onView?: (order: IOrderList) => void
	role?: RoleEnum | null
}

function HistoryCard({ order, onView, role }: HistoryCardProps) {
	const { t } = useI18n()
	const statusLabel = getOrderStatusLabel(order.status, t)
	const statusVariant = getOrderStatusVariant(order.status)
	const ratingItems = getRatingsForRole(order, role)
	const participantItems = [
		{ icon: Building2, id: order.customer_id, name: order.customer_name, label: t('history.card.customer') },
		{ icon: Building2, id: order.logistic_id, name: order.logistic_name, label: t('history.card.logistic') },
		{ icon: Building2, id: order.carrier_id, name: order.carrier_name, label: t('history.card.carrier') },
	]

	const sections: CardSection[] = [
		{
			title: t('history.card.section.route'),
			items: [
				{ icon: MapPin, primary: order.origin_city || t('history.placeholder'), secondary: t('history.card.load') },
				{ icon: MapPin, primary: order.destination_city || t('history.placeholder'), secondary: t('history.card.unload') },
				{ icon: RouteIcon, primary: formatDistanceKm(order.route_distance_km), secondary: t('history.card.distance') },
			],
		},
		{
			title: t('history.card.section.dates'),
			items: [
				{ icon: CalendarDays, primary: formatDateValue(order.load_date), secondary: t('history.card.loadDate') },
				{ icon: CalendarDays, primary: formatDateValue(order.delivery_date), secondary: t('history.card.deliveryDate') },
				{ icon: CalendarDays, primary: formatDateValue(order.created_at), secondary: t('history.card.createdAt') },
			],
		},
		{
			title: t('history.card.section.price'),
			items: [
				{ icon: Wallet, primary: formatPriceValue(order.price_total, order.currency), secondary: t('history.card.total') },
				{ icon: Wallet, primary: formatPricePerKmValue(order.price_per_km, order.currency), secondary: t('history.card.pricePerKm') },
				{
					icon: Wallet,
					primary: order.currency_display || order.currency || t('history.placeholder'),
					secondary: t('history.card.currency'),
				},
			],
		},
		{
			title: t('history.card.section.documents'),
			items: [{ icon: FileText, primary: order.documents_count ?? 0, secondary: t('history.card.documentsCount') }],
		},
		{
			title: t('history.table.rating'),
			items: ratingItems.length
				? ratingItems.map((item) => ({
						icon: Star,
						primary: (
							<span className='inline-flex items-center gap-1'>
								{item.value ?? t('history.placeholder')}
								{item.value ? <Star className='size-4 text-warning-500 fill-warning-500' /> : null}
							</span>
						),
						secondary: t(`history.table.rating.${item.key}`),
					}))
				: [{ icon: Star, primary: t('history.placeholder'), secondary: t('history.table.rating') }],
		},
	]

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<div>
						<CardTitle className='text-lg font-semibold leading-tight text-foreground'>
							{t('history.card.title', { id: order.id })}
						</CardTitle>
						<p className='text-sm text-muted-foreground'>
							{order.customer_name || t('history.card.customerMissing')}
						</p>
					</div>
					<Badge variant={statusVariant}>{statusLabel}</Badge>
				</div>
				<div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
					<UuidCopy id={order.id} />
					<span>{t('history.card.documentsLabel', { count: order.documents_count ?? 0 })}</span>
				</div>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<section className='flex flex-col gap-2'>
					<span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{t('history.card.section.participants')}</span>
					<div className='grid grid-cols-1 gap-2'>
						{participantItems.map((item, index) => (
							<div
								key={`participants-${order.id}-${index}`}
								className='flex w-full items-center gap-2 rounded-full bg-card px-4 py-2'
							>
								<item.icon className='size-4 text-muted-foreground' aria-hidden />
									<div className='flex flex-col leading-tight'>
										<span className='font-medium text-foreground'>
											{item.name ? (
												item.id ? (
													<ProfileLink id={item.id} name={item.name} />
												) : (
													item.name
												)
											) : (
												t('history.placeholder')
											)}
										</span>
										<span className='text-xs text-muted-foreground'>{item.label}</span>
									</div>
								</div>
							))}
					</div>
				</section>
				<CardSections sections={sections} />
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Button className='min-w-[140px] flex-1' onClick={() => onView?.(order)}>
					{t('history.card.open')}
				</Button>
			</CardFooter>
		</Card>
	)
}
