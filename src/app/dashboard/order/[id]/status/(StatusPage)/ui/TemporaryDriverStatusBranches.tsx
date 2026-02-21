'use client'

import type { TimelineSection } from '../types'
import { EmptyTimelineState } from './EmptyTimelineState'

type TemporaryDriverStatusBranchesProps = {
	t: (key: string, params?: Record<string, string>) => string
	timelineSections: TimelineSection[]
	hasHistory: boolean
}

// TODO[TEMP_HIDE_MAPS_NON_DEV]: remove this fallback when maps are re-enabled outside development.
export function TemporaryDriverStatusBranches({ t, timelineSections, hasHistory }: TemporaryDriverStatusBranchesProps) {
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
									<div className='rounded-2xl bg-muted/50 p-2 sm:p-5'>
										<p className='text-base font-semibold text-foreground sm:text-2xl'>{event.author}</p>
										<p className='mt-4 text-sm text-muted-foreground sm:text-lg'>
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

