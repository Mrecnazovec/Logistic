'use client'

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { useI18n } from '@/i18n/I18nProvider'
import { IRatingUserList } from '@/shared/types/Rating.interface'
import { format } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import { BadgeCheck, Briefcase, CalendarDays, Globe2, Star, UserRound } from 'lucide-react'
import { useMemo } from 'react'

type RatingCardListProps = {
	items: IRatingUserList[]
	serverPagination?: ServerPaginationMeta
}

export function RatingCardList({ items, serverPagination }: RatingCardListProps) {
	const pagination = useCardPagination(serverPagination)

	if (!items.length) return null

	return (
		<CardListLayout
			items={items}
			getKey={(rating) => rating.id}
			renderItem={(rating) => <RatingCard rating={rating} />}
			pagination={pagination}
		/>
	)
}

type RatingCardProps = {
	rating: IRatingUserList
}

function RatingCard({ rating }: RatingCardProps) {
	const { t, locale } = useI18n()
	const dateLocale = locale === 'en' ? enUS : ru
	const registeredAt = rating.registered_at
		? format(new Date(rating.registered_at), 'dd.MM.yyyy', { locale: dateLocale })
		: '-'

	const toNumber = (value: number | string | null | undefined) => {
		if (value === null || value === undefined) return null
		const num = typeof value === 'string' ? Number(value) : value
		return Number.isFinite(num) ? num : null
	}

	const avgRatingValue = toNumber(rating.avg_rating)
	const ratingCount = toNumber(rating.rating_count)
	const completedOrders = toNumber(rating.completed_orders)
	const numberLocale = locale === 'en' ? 'en-US' : 'ru-RU'

	const sections = useMemo(
		() => [
			{
				title: t('rating.card.section.company'),
				items: [
					{
						icon: BadgeCheck,
						primary: rating.company_name ?? '-',
						secondary: t('rating.card.company'),
					},
					{
						icon: UserRound,
						primary: rating.display_name ?? '-',
						secondary: t('rating.card.person'),
					},
				],
			},
			{
				title: t('rating.card.section.rating'),
				items: [
					{
						icon: Star,
						primary: `${avgRatingValue !== null ? avgRatingValue.toFixed(1) : '-'} / 5`,
						secondary: t('rating.card.reviews', {
							count: ratingCount !== null ? ratingCount.toLocaleString(numberLocale) : '-',
						}),
					},
					{
						icon: Briefcase,
						primary: completedOrders !== null ? completedOrders.toLocaleString(numberLocale) : '-',
						secondary: t('rating.card.completedDeals'),
					},
				],
			},
			{
				title: t('rating.card.section.extra'),
				items: [
					{
						icon: Globe2,
						primary: rating.country ?? '-',
						secondary: t('rating.card.country'),
					},
					{
						icon: CalendarDays,
						primary: registeredAt,
						secondary: t('rating.card.registeredAt'),
					},
				],
			},
		],
		[
			t,
			numberLocale,
			avgRatingValue,
			completedOrders,
			rating.company_name,
			rating.country,
			rating.display_name,
			ratingCount,
			registeredAt,
		],
	)

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>
						{t('rating.card.title', { id: rating.id, name: rating.company_name ?? rating.display_name ?? t('rating.card.noName') })}
					</CardTitle>
					<span className='flex items-center gap-2 rounded-full bg-warning-50 px-3 py-1 text-sm font-semibold text-warning-700'>
						<Star className='size-4 text-warning-500 fill-warning-500' aria-hidden />
						{avgRatingValue !== null ? avgRatingValue.toFixed(1) : '-'}
					</span>
				</div>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />
			</CardContent>
		</Card>
	)
}
