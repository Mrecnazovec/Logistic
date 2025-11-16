'use client'

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { IUserRating } from '@/shared/types/Rating.interface'
import { BadgeCheck, PhoneCall, Star, UserRound } from 'lucide-react'
import { useMemo } from 'react'

type RatingCardListProps = {
	items: IUserRating[]
	serverPagination?: ServerPaginationMeta
	roleLabel: string
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
	rating: IUserRating
	roleLabel: string
}

function RatingCard({ rating, roleLabel }: RatingCardProps) {
	const sections = useMemo(
		() => [
			{
				title: 'Компания и водитель',
				items: [
					{
						icon: BadgeCheck,
						primary: rating.rated_user ?? '—',
						secondary: roleLabel === 'carriers' ? 'Перевозчик' : 'Компания',
					},
					{
						icon: UserRound,
						primary: rating.rated_user ?? '—',
						secondary: 'Водитель',
					},
				],
			},
			{
				title: 'Контакты',
				items: [
					{
						icon: PhoneCall,
						primary: rating.rated_user ?? '—',
						secondary: 'Логин/контакт',
					},
				],
			},
			// {
			// 	title: 'Активность',
			// 	items: [
			// 		{
			// 			icon: BadgeCheck,
			// 			primary: formatDateValue(rating.registered_at),
			// 			secondary: 'Дата регистрации',
			// 		},
			// 		{
			// 			icon: BadgeCheck,
			// 			primary: rating.orders_completed?.toLocaleString('ru-RU') ?? '—',
			// 			secondary: 'Завершено заказов',
			// 		},
			// 	],
			// },
		],
		[roleLabel, rating],
	)

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>
						#{rating.id} — {rating.rated_user}
					</CardTitle>
					<span className='flex items-center gap-2 rounded-full bg-warning-50 px-3 py-1 text-sm font-semibold text-warning-700'>
						<Star className='size-4 fill-yellow-400 text-yellow-400' aria-hidden />
						{rating.score.toFixed(1)}
					</span>
				</div>
				<p className='text-sm text-muted-foreground'>
					Обновлено:
				</p>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />
			</CardContent>


		</Card>
	)
}
