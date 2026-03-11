import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import type { AnalyticsCard } from '../types/cabinet'

type AnalyticsDetailCardProps = {
	card: AnalyticsCard
	isLoadingAnalytics: boolean
}

export function AnalyticsDetailCard({ card, isLoadingAnalytics }: AnalyticsDetailCardProps) {
	const Icon = card.icon

	return (
		<Card className='gap-3 rounded-[24px] border-border/40 px-5 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)]'>
			<div className='flex items-start justify-between gap-4'>
				<div className='space-y-1.5'>
					<p className='text-xs text-muted-foreground'>{card.title}</p>
					{isLoadingAnalytics ? (
						<Skeleton className='h-7 w-24 rounded-2xl' />
					) : (
						<p className='text-xl font-semibold text-foreground'>{card.value}</p>
					)}
				</div>
				<div className={`flex size-11 shrink-0 items-center justify-center rounded-full ${card.accentClass}`}>
					<Icon className='size-5' />
				</div>
			</div>
			<div className='mt-3 space-y-1'>
				{isLoadingAnalytics ? (
					<Skeleton className='h-3.5 w-28 rounded-full' />
				) : (
					<>
						{card.trend ? (
							<p className={`text-xs ${card.trendVariant === 'danger' ? 'text-rose-500' : 'text-emerald-600'}`}>
								{card.trend} {card.trendLabel}
							</p>
						) : null}
						{card.description ? <p className='text-xs text-muted-foreground'>{card.description}</p> : null}
					</>
				)}
			</div>
		</Card>
	)
}
