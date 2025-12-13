'use client'

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections, type CardSection } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { formatDateTimeValue } from '@/lib/formatters'
import type { IAgreement } from '@/shared/types/Agreement.interface'
import { BadgeCheck, Clock4, ClipboardList, FileCheck2 } from 'lucide-react'
import Link from 'next/link'

type AgreementsCardListProps = {
	agreements: IAgreement[]
	serverPagination?: ServerPaginationMeta
}

export function AgreementsCardList({ agreements, serverPagination }: AgreementsCardListProps) {
	const pagination = useCardPagination(serverPagination)

	if (!agreements.length) return null

	return (
		<CardListLayout
			items={agreements}
			getKey={(agreement) => agreement.id}
			renderItem={(agreement) => <AgreementCard agreement={agreement} />}
			pagination={pagination}
		/>
	)
}

const statusLabels: Record<IAgreement['status'], string> = {
	pending: 'Ожидает подтверждения',
	accepted: 'Принято',
	expired: 'Истекло',
	cancelled: 'Отменено',
}

const booleanLabel = (value?: boolean | null) => {
	if (value === null || value === undefined) return '—'
	return value ? 'Да' : 'Нет'
}

function AgreementCard({ agreement }: { agreement: IAgreement }) {
	const sections: CardSection[] = [
		{
			title: 'Статус и сроки',
			items: [
				{ icon: BadgeCheck, primary: statusLabels[agreement.status] ?? '—', secondary: 'Статус' },
				{ icon: Clock4, primary: formatDateTimeValue(agreement.expires_at, '—'), secondary: 'Истекает' },
				{ icon: Clock4, primary: formatDateTimeValue(agreement.created_at, '—'), secondary: 'Создано' },
			],
		},
		{
			title: 'Идентификаторы',
			items: [
				{ icon: ClipboardList, primary: <UuidCopy id={agreement.id} isPlaceholder/> },
				{ icon: ClipboardList, primary: agreement.offer_id ?? '—', secondary: 'Оффер ID' },
				{ icon: ClipboardList, primary: agreement.cargo_id ?? '—', secondary: 'Груз ID' },
			],
		},
		{
			title: 'Подтверждения',
			items: [
				{ icon: FileCheck2, primary: booleanLabel(agreement.accepted_by_customer), secondary: 'Заказчик' },
				{ icon: FileCheck2, primary: booleanLabel(agreement.accepted_by_carrier), secondary: 'Перевозчик' },
				{ icon: FileCheck2, primary: booleanLabel(agreement.accepted_by_logistic), secondary: 'Посредник' },
			],
		},
	]

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b'>
				<div className='flex items-center justify-between gap-3 text-sm text-muted-foreground'>
					<UuidCopy id={agreement.id} isPlaceholder />
					<span className='ml-auto'>Груз: {agreement.cargo_id ?? '—'}</span>
				</div>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Link className='flex-1 min-w-[140px]' href={`/dashboard/order/agreement/${agreement.id}`}>
					<Button className='w-full bg-warning-400 hover:bg-warning-500 text-white'>Открыть</Button>
				</Link>
			</CardFooter>
		</Card>
	)
}
