'use client'

import { CardListLayout } from '@/components/card/CardListLayout'
import { CardSections, type CardSection } from '@/components/card/CardSections'
import { useCardPagination } from '@/components/pagination/CardPagination'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'
import type { ServerPaginationMeta } from '@/components/ui/table/DataTable'
import { useI18n } from '@/i18n/I18nProvider'
import { formatDateValue } from '@/lib/formatters'
import type { IAgreement } from '@/shared/types/Agreement.interface'
import { BadgeCheck, Clock4, MapPin, User } from 'lucide-react'
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

function AgreementCard({ agreement }: { agreement: IAgreement }) {
	const { t } = useI18n()
	const placeholder = t('transportation.agreement.card.placeholder')
	const statusLabels: Record<IAgreement['status'], string> = {
		pending: t('transportation.agreement.status.pending'),
		accepted: t('transportation.agreement.status.accepted'),
		expired: t('transportation.agreement.status.expired'),
		cancelled: t('transportation.agreement.status.cancelled'),
	}
	const acceptedLabel = (value?: boolean | null) => {
		if (value === null || value === undefined) return placeholder
		return value ? t('transportation.agreement.accepted.yes') : t('transportation.agreement.accepted.no')
	}
	const participantName = (role: string) => {
		const participant = agreement.participants?.find((item) => item.role === role)
		return participant?.full_name || placeholder
	}
	const executorName = () => {
		const carrier = agreement.participants?.find((item) => item.role === 'CARRIER')
		if (carrier?.full_name) return carrier.full_name
		const logistic = agreement.participants?.find((item) => item.role === 'LOGISTIC')
		return logistic?.full_name || placeholder
	}
	const sections: CardSection[] = [
		{
			title: t('transportation.agreement.card.section.status'),
			items: [
				{ icon: BadgeCheck, primary: statusLabels[agreement.status] ?? placeholder, secondary: t('transportation.agreement.card.label.status') },
				{ icon: Clock4, primary: formatDateValue(agreement.expires_at, 'dd.MM.yyyy HH:mm', placeholder), secondary: t('transportation.agreement.card.label.expires') },
				{ icon: Clock4, primary: formatDateValue(agreement.created_at, 'dd.MM.yyyy HH:mm', placeholder), secondary: t('transportation.agreement.card.label.created') },
			],
		},
		{
			title: t('transportation.agreement.card.section.route'),
			items: [
				{
					icon: MapPin,
					primary: agreement.loading_city || placeholder,
					secondary: formatDateValue(agreement.loading_date, 'dd.MM.yyyy', placeholder),
				},
				{
					icon: MapPin,
					primary: agreement.unloading_city || placeholder,
					secondary: formatDateValue(agreement.unloading_date, 'dd.MM.yyyy', placeholder),
				},
			],
		},
		{
			title: t('transportation.agreement.card.section.participants'),
			items: [
				{
					icon: User,
					primary: participantName('CUSTOMER'),
					secondary: acceptedLabel(agreement.accepted_by_customer),
				},
				{
					icon: User,
					primary: executorName(),
					secondary: acceptedLabel(Boolean(agreement.accepted_by_carrier || agreement.accepted_by_logistic)),
				},
			],
		},
	]

	return (
		<Card className='h-full rounded-3xl border-0 xs:bg-neutral-500'>
			<CardHeader className='gap-4 border-b'>
				<div className='flex items-center justify-between gap-3 text-sm text-muted-foreground'>
					<UuidCopy id={agreement.id} isPlaceholder />
				</div>
			</CardHeader>

			<CardContent className='flex flex-col gap-5 py-6'>
				<CardSections sections={sections} />
			</CardContent>

			<CardFooter className='flex flex-wrap gap-3 border-t pt-4'>
				<Link className='flex-1 min-w-[140px]' href={`/dashboard/order/agreement/${agreement.id}`}>
					<Button className='w-full bg-warning-400 hover:bg-warning-500 text-white'>{t('transportation.agreement.card.open')}</Button>
				</Link>
			</CardFooter>
		</Card>
	)
}
