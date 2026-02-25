'use client'

import { Badge } from '@/components/ui/Badge'

type StatusProgressCardProps = {
	t: (key: string, params?: Record<string, string>) => string
	orderStatusLabel: string
	orderStatusVariant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'destructive' | 'outline'
	routeCities: string[]
	canShowProgress: boolean
	progressPercent: number | null
	progressPlaceholderKey: string
	remainingHours: number | null
	remainingMinutes: number | null
	viaCities: string[]
}

export function StatusProgressCard({
	t,
	orderStatusLabel,
	orderStatusVariant,
	routeCities,
	canShowProgress,
	progressPercent,
	progressPlaceholderKey,
	remainingHours,
	remainingMinutes,
	viaCities,
}: StatusProgressCardProps) {
	return (
		<section className='rounded-3xl border bg-muted/20 p-4 sm:p-5'>
			<div className='flex items-center justify-between gap-3'>
				<h2 className='text-lg font-semibold text-foreground sm:text-xl'>{t('order.status.progress.title')}</h2>
				<Badge variant={orderStatusVariant}>{orderStatusLabel}</Badge>
			</div>

			{routeCities.length > 0 ? (
				<div className='mt-5 flex items-center justify-between gap-2 text-xs text-muted-foreground'>
					{routeCities.map((city) => (
						<p key={city} className='truncate text-center font-medium'>
							{city}
						</p>
					))}
				</div>
			) : null}

			<div className='mt-3'>
				<div className='relative h-10 rounded-full bg-muted'>
					{canShowProgress && progressPercent !== null ? (
						<div
							className='h-full rounded-full bg-gradient-to-r from-[#0f4acb] to-[#63aaf7] transition-all'
							style={{ width: `${Math.max(0, Math.min(progressPercent, 100))}%` }}
						/>
					) : (
						<div className='flex h-full items-center justify-center px-3 text-sm text-muted-foreground'>{t(progressPlaceholderKey)}</div>
					)}

					{canShowProgress && routeCities.length > 2
						? routeCities.slice(1, -1).map((city, index) => {
								const left = ((index + 1) / (routeCities.length - 1)) * 100
								return [
									<span key={`${city}-line`} aria-hidden className='absolute inset-y-1 w-px bg-border/70' style={{ left: `${left}%` }} />,
									<span
										key={`${city}-dot`}
										aria-hidden
										className='absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background ring-1 ring-border'
										style={{ left: `${left}%` }}
									/>,
								]
						  })
						: null}
				</div>

				{canShowProgress ? (
					<div className='mt-3 flex items-center justify-between gap-3 text-sm'>
						<p className='font-medium text-foreground'>
							{remainingMinutes !== null && remainingMinutes < 30
								? t('order.status.progress.arrivingSoon')
								: remainingMinutes !== null
									? t('order.status.progress.remainingMinutes', { minutes: String(remainingMinutes) })
								: remainingHours !== null
									? t('order.status.progress.remainingHours', { hours: String(remainingHours) })
									: t('order.status.timeline.notSpecified')}
						</p>
						{viaCities.length > 0 ? (
							<p className='truncate text-muted-foreground'>
								{t('order.status.progress.via')}: {viaCities.join(' · ')}
							</p>
						) : null}
					</div>
				) : null}
			</div>
		</section>
	)
}
