'use client'

import { UserRound } from 'lucide-react'
import type { TimelineSection } from '../types'
import { EmptyTimelineState } from './EmptyTimelineState'

type StatusTimelineFeedProps = {
	t: (key: string, params?: Record<string, string>) => string
	timelineSections: TimelineSection[]
	hasHistory: boolean
}

export function StatusTimelineFeed({ t, timelineSections, hasHistory }: StatusTimelineFeedProps) {
	return (
		<section className='h-[420px] overflow-auto rounded-3xl border bg-muted/20 p-4 sm:p-5'>
			{hasHistory ? (
				<div className='space-y-7'>
					{timelineSections.map((section) => (
						<section key={section.id} className='space-y-4'>
							<p className='text-xl font-semibold text-foreground'>{section.title}</p>
							<div className='space-y-5'>
								{section.events.map((event, eventIndex) => {
									const isLastEvent = eventIndex === section.events.length - 1
									const initial = event.author.trim().charAt(0).toUpperCase() || 'S'

									return (
										<div key={event.id} className='grid grid-cols-[66px_minmax(0,1fr)] gap-3'>
											<div className='relative text-sm text-muted-foreground'>
												<p className='pt-1'>{event.timeLabel}</p>
												<span className='absolute left-1 top-8 size-3 shrink-0 rounded-full bg-brand shadow-[0_0_0_3px_rgba(37,99,235,0.2)]' />
												{!isLastEvent ? <span className='absolute left-[7px] top-11 h-[calc(100%+14px)] w-px bg-border' /> : null}
											</div>
											<article className='rounded-2xl bg-background p-4'>
												<div className='flex items-start gap-3'>
													<div className='grid size-10 shrink-0 place-items-center rounded-full bg-brand/15 text-brand'>
														{initial === 'S' ? <UserRound className='size-5' /> : <span className='text-sm font-semibold'>{initial}</span>}
													</div>
													<div>
														<p className='text-base font-semibold text-foreground'>{event.author}</p>
														<p className='mt-1.5 text-sm text-muted-foreground'>
															{t('order.status.timeline.changed', {
																from: event.statusFrom,
																to: event.statusTo,
															})}
														</p>
													</div>
												</div>
											</article>
										</div>
									)
								})}
							</div>
						</section>
					))}
				</div>
			) : (
				<EmptyTimelineState />
			)}
		</section>
	)
}

