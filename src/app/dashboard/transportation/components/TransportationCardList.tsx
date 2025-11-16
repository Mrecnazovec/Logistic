'use client'

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections, type CardSection } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { DASHBOARD_URL } from '@/config/url.config'
import { getTransportationStatusMeta } from '@/app/dashboard/transportation/constants/statusMeta'
import Link from 'next/link'
import type { IOrderList } from '@/shared/types/Order.interface'

type TransportationCardListProps = {
	cargos: IOrderList[]
	serverPagination?: ServerPaginationMeta
	statusValue: string
}

export function TransportationCardList({ cargos, serverPagination, statusValue }: TransportationCardListProps) {
	const pagination = useCardPagination(serverPagination)

	if (!cargos.length) {
		return null
	}

	return (
		<CardListLayout
			items={cargos}
			getKey={(cargo) => cargo.id}
			renderItem={(cargo) => <TransportationCard cargo={cargo} statusValue={statusValue} />}
			pagination={pagination}
		/>
	)
}

type TransportationCardProps = {
	cargo: IOrderList
	statusValue: string
}

function TransportationCard({ cargo, statusValue }: TransportationCardProps) {
	const { badgeVariant, label: statusLabel } = getTransportationStatusMeta(statusValue)
	const sections: CardSection[] = []

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b pb-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<Badge variant={badgeVariant}>{statusLabel}</Badge>
					<CardTitle className='text-lg font-semibold leading-tight text-foreground'>������ �� ��������</CardTitle>
					<UuidCopy id={cargo.id} />
				</div>
				<div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
					<span>��������: ������ ����������</span>
				</div>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Link className='flex-1 min-w-[140px]' href={DASHBOARD_URL.order(String(cargo.id))}>
					<Button className='w-full bg-warning-400 hover:bg-warning-500 text-white'>��������</Button>
				</Link>
				<Button className='flex-1 min-w-[140px] bg-error-400 hover:bg-error-500 text-white'>���������</Button>
			</CardFooter>
		</Card>
	)
}
