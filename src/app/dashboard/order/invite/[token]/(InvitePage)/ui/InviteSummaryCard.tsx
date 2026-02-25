import { ArrowRight } from 'lucide-react'
import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { DEFAULT_PLACEHOLDER } from '@/lib/formatters'
import type { InvitePageTranslator, InvitePreviewViewModel } from '../types/invitePage.types'

type InviteSummaryCardProps = {
	model: InvitePreviewViewModel
	t: InvitePageTranslator
}

export function InviteSummaryCard({ model, t }: InviteSummaryCardProps) {
	return (
		<Card className='rounded-3xl shadow-lg border-none'>
			<CardHeader className='pb-4'>
				<CardTitle className='text-2xl font-bold'>{t('order.invite.form.title')}</CardTitle>
				<p className='text-sm text-muted-foreground'>{t('order.invite.form.description')}</p>
			</CardHeader>
			<CardContent className='space-y-5'>
				<div className='grid gap-4 md:grid-cols-[1fr_auto_1fr] items-start'>
					<div>
						<p className='font-semibold text-foreground'>{model.originCity}</p>
						<p className='text-sm text-muted-foreground'>{model.formattedLoadDate}</p>
					</div>
					<div className='flex flex-col items-center justify-center text-sm font-semibold text-muted-foreground'>
						<ArrowRight className='mb-1 size-5' />
						<span>{model.distanceText}</span>
					</div>
					<div>
						<p className='font-semibold text-foreground'>{model.destinationCity}</p>
						<p className='text-sm text-muted-foreground'>{model.formattedDeliveryDate}</p>
					</div>
				</div>
				<div className='grid gap-4 md:grid-cols-3 text-sm text-muted-foreground'>
					<p>
						<span className='font-semibold text-foreground'>{t('order.invite.transportType')}: </span>
						{model.transport}
					</p>
					<p>
						<span className='font-semibold text-foreground'>{t('order.invite.weight')}: </span>
						{model.weightText}
					</p>
					<p>
						<span className='font-semibold text-foreground'>{t('order.field.price')}: </span>
						{model.formattedPrice}
					</p>
				</div>
				<div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
					<span className='font-semibold text-foreground'>{t('order.invite.company')}:</span> {model.inviterCompany}
				</div>
				<div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
					<span className='font-semibold text-foreground'>{t('order.invite.representative')}:</span>{' '}
					{model.inviterId ? <ProfileLink id={model.inviterId} name={model.inviterName} /> : model.inviterName || DEFAULT_PLACEHOLDER}
				</div>
			</CardContent>
		</Card>
	)
}
