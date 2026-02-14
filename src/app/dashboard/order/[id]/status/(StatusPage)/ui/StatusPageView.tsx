'use client'

import { Badge } from '@/components/ui/Badge'
import type { StatusPageViewProps, TimelineSection } from '../types'
import { EmptyTimelineState } from './EmptyTimelineState'
import { OrderRouteMap } from './OrderRouteMap'

type TimelineOnlyProps = {
	t: (key: string, params?: Record<string, string>) => string
	timelineSections: TimelineSection[]
	hasHistory: boolean
}

// TODO[TEMP_HIDE_MAPS_NON_DEV]: remove this fallback when maps are re-enabled outside development.
function TemporaryDriverStatusBranches({ t, timelineSections, hasHistory }: TimelineOnlyProps) {
	if (!hasHistory) return <EmptyTimelineState />

	return (
		<div className='space-y-8'>
			{timelineSections.map((section) => (
				<section key={section.id} className='space-y-4'>
					<h3 className='text-3xl font-semibold text-foreground'>{section.title}</h3>
					<div className='space-y-6'>
						{section.events.map((event, eventIndex) => {
							const isLastEvent = eventIndex === section.events.length - 1

							return (
								<div key={event.id} className='grid grid-cols-[50px_minmax(0,1fr)] gap-6'>
									<div className='relative pt-1 text-sm text-muted-foreground'>
										<span className='inline-block pt-5'>{event.timeLabel}</span>
										<span className='absolute left-2.5 top-2.5 size-3 rounded-full bg-brand shadow-[0_0_0_3px_rgba(37,99,235,0.2)]' />
										{!isLastEvent ? <span className='absolute left-[15px] top-6 h-[calc(100%+18px)] w-px bg-border' /> : null}
									</div>
									<div className='rounded-2xl bg-muted/50 sm:p-5 p-2'>
										<p className='sm:text-2xl text-base font-semibold text-foreground'>{event.author}</p>
										<p className='mt-4 sm:text-lg text-sm text-muted-foreground'>
											{t('order.status.timeline.changed', {
												from: event.statusFrom,
												to: event.statusTo,
											})}
										</p>
									</div>
								</div>
							)
						})}
					</div>
				</section>
			))}
		</div>
	)
}

export function StatusPageView({
	t,
	locale,
	order,
	apiKey,
	showMap = true,
	timelineSections,
	hasHistory,
	orderStatusLabel,
	orderStatusVariant,
}: StatusPageViewProps) {
	if (!showMap) {
		return <TemporaryDriverStatusBranches t={t} timelineSections={timelineSections} hasHistory={hasHistory} />
	}

	return (
		<div className='grid h-full min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-6'>
			<OrderRouteMap order={order} apiKey={apiKey} locale={locale} />

			<section className='flex h-full min-h-0 flex-col rounded-3xl border bg-muted/20 p-4 sm:p-5'>
				<div className='flex items-center justify-between gap-3'>
					<h2 className='text-lg font-semibold text-foreground sm:text-xl'>{t('order.status.meta.title')}</h2>
					<Badge variant={orderStatusVariant}>{orderStatusLabel}</Badge>
				</div>

				<div className='mt-5 min-h-0 flex-1 overflow-auto'>
					{hasHistory ? (
						<div className='space-y-7'>
							{timelineSections.map((section) => (
								<section key={section.id} className='space-y-4'>
									<p className='text-sm font-semibold text-foreground'>{section.title}</p>
									<div className='relative pl-6'>
										<span aria-hidden className='absolute bottom-2 left-2 top-2 w-px bg-border' />
										<div className='space-y-4'>
											{section.events.map((event, eventIndex) => {
												const isLastEvent = eventIndex === section.events.length - 1

												return (
													<article key={event.id} className='relative rounded-2xl bg-background p-3'>
														<span
															aria-hidden
															className='absolute -left-[21px] top-1 size-3 rounded-full border border-brand bg-background'
														/>
														{isLastEvent ? <span aria-hidden className='absolute -left-4 bottom-0 top-7 w-px bg-muted/20' /> : null}
														<div className='flex items-start justify-between gap-3'>
															<div>
																<p className='text-sm font-semibold text-foreground'>{event.author}</p>
																<p className='mt-1 text-xs text-muted-foreground'>
																	{t('order.status.timeline.changed', {
																		from: event.statusFrom,
																		to: event.statusTo,
																	})}
																</p>
															</div>
															<p className='text-xs font-medium text-muted-foreground'>{event.timeLabel}</p>
														</div>
													</article>
												)
											})}
										</div>
									</div>
								</section>
							))}
						</div>
					) : (
						<EmptyTimelineState />
					)}
				</div>
			</section>
		</div>
	)
}
