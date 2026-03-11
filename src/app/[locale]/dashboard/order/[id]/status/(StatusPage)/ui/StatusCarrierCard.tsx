'use client'

import { Badge } from '@/components/ui/Badge'
import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { Clock3, Gauge, MapPin } from 'lucide-react'

type StatusCarrierCardProps = {
	t: (key: string, params?: Record<string, string>) => string
	carrierStatusLabel: string
	carrierStatusVariant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'destructive' | 'outline'
	carrierId?: number
	carrierName: string
	carrierLocation: string
	remainingKmLabel: string
	speedLabel: string
	updatedAt: string
}

export function StatusCarrierCard({
	t,
	carrierStatusLabel,
	carrierStatusVariant,
	carrierId,
	carrierName,
	carrierLocation,
	remainingKmLabel,
	speedLabel,
	updatedAt,
}: StatusCarrierCardProps) {
	return (
		<section className='rounded-3xl border bg-muted/20 p-4 sm:p-5'>
			<div className='flex items-center justify-between gap-3'>
				<h3 className='text-lg font-semibold text-foreground'>{t('order.status.carrier.title')}</h3>
				<Badge variant={carrierStatusVariant}>{carrierStatusLabel}</Badge>
			</div>

			<div className='mt-4'>
				{carrierId ? (
					<ProfileLink id={carrierId} name={carrierName} className='text-xl font-medium' />
				) : (
					<p className='text-2xl font-medium text-foreground'>{carrierName}</p>
				)}
			</div>

			<div className='mt-4 space-y-3 text-base text-foreground'>
				<p className='flex items-center gap-2'>
					<MapPin className='size-5 text-foreground/80' />
					<span>{carrierLocation}</span>
				</p>
				<p>
					{t('order.status.carrier.remaining')} <span className='font-semibold text-brand'>{remainingKmLabel}</span>
				</p>
				<p className='flex items-center gap-2'>
					<Gauge className='size-5 text-foreground/80' />
					<span>
						{t('order.status.carrier.speed')}: <span className='font-semibold text-brand'>{speedLabel}</span>
					</span>
				</p>
				<p className='flex items-center gap-2 text-muted-foreground'>
					<Clock3 className='size-5' />
					<span>
						{t('order.status.carrier.updated')}: <span className='text-brand'>{updatedAt}</span>
					</span>
				</p>
			</div>
		</section>
	)
}
