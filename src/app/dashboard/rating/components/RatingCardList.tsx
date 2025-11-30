'use client'

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { IRatingUser } from '@/shared/types/Rating.interface'
import { BadgeCheck, Briefcase, CalendarDays, Globe2, Star, UserRound } from 'lucide-react'
import { format } from 'date-fns'
import { useMemo } from 'react'

type RatingCardListProps = {
	items: IRatingUser[]
	serverPagination?: ServerPaginationMeta
	roleLabel: string
}

const roleLabels: Record<IRatingUser['role'], string> = {
	LOGISTIC: 'Logistic',
	CUSTOMER: 'Customer',
	CARRIER: 'Carrier',
}

export function RatingCardList({ items, serverPagination, roleLabel }: RatingCardListProps) {
	const pagination = useCardPagination(serverPagination)

	if (!items.length) return null

	return (
		<CardListLayout
			items={items}
			getKey={(rating) => rating.id}
			renderItem={(rating) => <RatingCard rating={rating} roleLabel={roleLabel} />}
			pagination={pagination}
		/>
	)
}

type RatingCardProps = {
	rating: IRatingUser
	roleLabel: string
}

function RatingCard({ rating, roleLabel }: RatingCardProps) {
	const registeredAt = rating.registered_at
		? format(new Date(rating.registered_at), 'dd.MM.yyyy')
		: '-'

	const sections = useMemo(
		() => [
			{
				title: 'Company & contact',
				items: [
					{
						icon: BadgeCheck,
						primary: rating.company_name ?? '-',
						secondary: 'Company',
					},
					{
						icon: UserRound,
						primary: rating.display_name ?? '-',
						secondary: 'Contact',
					},
				],
			},
			{
				title: 'Performance',
				items: [
					{
						icon: Star,
						primary: `${rating.avg_rating.toFixed(1)} / 5`,
						secondary: `${rating.rating_count.toLocaleString('ru-RU')} reviews`,
					},
					{
						icon: Briefcase,
						primary: rating.completed_orders.toLocaleString('ru-RU'),
						secondary: 'Completed orders',
					},
				],
			},
			{
				title: 'Extra',
				items: [
					{
						icon: Globe2,
						primary: rating.country ?? '-',
						secondary: 'Country',
					},
					{
						icon: CalendarDays,
						primary: registeredAt,
						secondary: 'Registered',
					},
				],
			},
		],
		[
			rating.avg_rating,
			rating.completed_orders,
			rating.company_name,
			rating.country,
			rating.display_name,
			rating.rating_count,
			registeredAt,
		],
	)

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>
						#{rating.id} - {rating.company_name ?? rating.display_name ?? 'No name'}
					</CardTitle>
					<span className='flex items-center gap-2 rounded-full bg-warning-50 px-3 py-1 text-sm font-semibold text-warning-700'>
						<Star className='size-4 fill-yellow-400 text-yellow-400' aria-hidden />
						{rating.avg_rating.toFixed(1)}
					</span>
				</div>
				<p className='text-sm text-muted-foreground'>
					Role: {roleLabels[rating.role] ?? roleLabel}
				</p>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />
			</CardContent>
		</Card>
	)
}
