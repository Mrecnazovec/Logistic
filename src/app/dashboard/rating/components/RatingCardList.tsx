'use client'

import {
	formatDateValue,
	formatRelativeDate
} from '@/app/dashboard/desk/components/cardFormatters'
import { CardPaginationControls, useDeskCardPagination } from '@/app/dashboard/desk/my/components/DeskCardPagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import type { IRatingTableRow } from '@/shared/types/RatingTableRow.interface'
import { BadgeCheck, PhoneCall, Star, UserRound } from 'lucide-react'
import { useMemo } from 'react'

type RatingCardListProps = {
	items: IRatingTableRow[]
	serverPagination?: ServerPaginationMeta
	roleLabel: string
}

export function RatingCardList({ items, serverPagination, roleLabel }: RatingCardListProps) {
	if (!items.length) return null

	const pagination = useDeskCardPagination(serverPagination)

	return (
		<div className='flex flex-1 flex-col gap-4'>
			<div className='flex-1 overflow-hidden rounded-4xl xs:bg-background xs:p-4'>
				<div className='grid h-full min-h-0 grid-cols-1 gap-4 overflow-y-auto pr-1 xl:grid-cols-2'>
					{items.map((rating) => (
						<RatingCard key={rating.id} rating={rating} roleLabel={roleLabel} />
					))}
				</div>
			</div>
			<CardPaginationControls pagination={pagination} />
		</div>
	)
}

type RatingCardProps = {
	rating: IRatingTableRow
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
						primary: rating.carrier_name ?? '—',
						secondary: roleLabel === 'carriers' ? 'Перевозчик' : 'Компания',
					},
					{
						icon: UserRound,
						primary: rating.driver_name ?? '—',
						secondary: 'Водитель',
					},
				],
			},
			{
				title: 'Контакты',
				items: [
					{
						icon: PhoneCall,
						primary: rating.login ?? '—',
						secondary: 'Логин/контакт',
					},
				],
			},
			{
				title: 'Активность',
				items: [
					{
						icon: BadgeCheck,
						primary: formatDateValue(rating.registered_at),
						secondary: 'Дата регистрации',
					},
					{
						icon: BadgeCheck,
						primary: rating.orders_completed?.toLocaleString('ru-RU') ?? '—',
						secondary: 'Завершено заказов',
					},
				],
			},
		],
		[roleLabel, rating],
	)

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>
						#{rating.id} — {rating.carrier_name ?? rating.driver_name ?? 'Без имени'}
					</CardTitle>
					<span className='flex items-center gap-2 rounded-full bg-warning-50 px-3 py-1 text-sm font-semibold text-warning-700'>
						<Star className='size-4 fill-yellow-400 text-yellow-400' aria-hidden />
						{rating.score.toFixed(1)}
					</span>
				</div>
				<p className='text-sm text-muted-foreground'>
					Обновлено: {formatRelativeDate(rating.registered_at)}
				</p>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				{sections.map((section) => (
					<section key={section.title} className='flex flex-col gap-2'>
						<span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{section.title}</span>
						<div className='flex flex-wrap gap-2'>
							{section.items.map((item, index) => (
								<div
									key={`${section.title}-${index}`}
									className='flex min-w-[160px] flex-1 items-center gap-2 rounded-full bg-card px-4 py-2'
								>
									<item.icon className='size-4 text-muted-foreground' aria-hidden />
									<div className='flex flex-col leading-tight'>
										<span className='font-medium text-foreground'>{item.primary}</span>
										<span className='text-xs text-muted-foreground'>{item.secondary}</span>
									</div>
								</div>
							))}
						</div>
					</section>
				))}
			</CardContent>


		</Card>
	)
}

