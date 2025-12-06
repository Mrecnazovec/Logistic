'use client'

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections, type CardSection } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatDateValue, formatDistanceKm, formatPricePerKmValue, formatPriceValue } from '@/lib/formatters'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import type { IOrderList } from '@/shared/types/Order.interface'
import { Building2, CalendarDays, FileText, MapPin, Route as RouteIcon, Wallet } from 'lucide-react'
import { useMemo } from 'react'
import { getOrderStatusLabel, getOrderStatusVariant } from '../orderStatusConfig'

type HistoryCardListProps = {
	orders: IOrderList[]
	serverPagination?: ServerPaginationMeta
	onView?: (order: IOrderList) => void
}

export function HistoryCardList({ orders, serverPagination, onView }: HistoryCardListProps) {
	const pagination = useCardPagination(serverPagination)

	if (!orders.length) return null

	return (
		<CardListLayout
			items={orders}
			getKey={(order) => order.id}
			renderItem={(order) => <HistoryCard order={order} onView={onView} />}
			pagination={pagination}
		/>
	)
}

type HistoryCardProps = {
	order: IOrderList
	onView?: (order: IOrderList) => void
}

function HistoryCard({ order, onView }: HistoryCardProps) {
	const statusLabel = getOrderStatusLabel(order.status)
	const statusVariant = getOrderStatusVariant(order.status)

	const sections: CardSection[] = useMemo(
		() => [
			{
				title: 'Участники',
				items: [
					{ icon: Building2, primary: order.customer_name || '-', secondary: 'Заказчик' },
					{ icon: Building2, primary: order.logistic_name || '-', secondary: 'Экспедитор' },
					{ icon: Building2, primary: order.carrier_name || '-', secondary: 'Перевозчик' },
				],
			},
			{
				title: 'Маршрут',
				items: [
					{ icon: MapPin, primary: order.origin_city || '-', secondary: 'Отправление' },
					{ icon: MapPin, primary: order.destination_city || '-', secondary: 'Назначение' },
					{ icon: RouteIcon, primary: formatDistanceKm(order.route_distance_km), secondary: 'Расстояние' },
				],
			},
			{
				title: 'Даты',
				items: [
					{ icon: CalendarDays, primary: formatDateValue(order.load_date), secondary: 'Дата погрузки' },
					{ icon: CalendarDays, primary: formatDateValue(order.delivery_date), secondary: 'Дата выгрузки' },
					{ icon: CalendarDays, primary: formatDateValue(order.created_at), secondary: 'Создан' },
				],
			},
			{
				title: 'Стоимость',
				items: [
					{ icon: Wallet, primary: formatPriceValue(order.price_total, order.currency), secondary: 'Фиксированная стоимость' },
					{ icon: Wallet, primary: formatPricePerKmValue(order.price_per_km, order.currency), secondary: 'Цена за км' },
					{ icon: Wallet, primary: order.currency_display || order.currency || '-', secondary: 'Валюта' },
				],
			},
			{
				title: 'Документы',
				items: [{ icon: FileText, primary: order.documents_count ?? 0, secondary: 'Количество' }],
			},
		],
		[order],
	)

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<div>
						<CardTitle className='text-lg font-semibold leading-tight text-foreground'>{`Заказ №${order.id}`}</CardTitle>
						<p className='text-sm text-muted-foreground'>{order.customer_name || 'Без названия заказчика'}</p>
					</div>
					<Badge variant={statusVariant}>{statusLabel}</Badge>
				</div>
				<div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
					<UuidCopy id={order.id} />
					<span>Документов: {order.documents_count ?? 0}</span>
				</div>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Button className='flex-1 min-w-[140px]' onClick={() => onView?.(order)}>
					Подробнее
				</Button>
			</CardFooter>
		</Card>
	)
}
