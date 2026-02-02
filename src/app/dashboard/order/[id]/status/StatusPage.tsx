"use client"

import { NoPhoto } from '@/components/ui/NoPhoto'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGetOrderStatusHistory } from '@/hooks/queries/orders/useGet/useGetOrderStatusHistory'
import { useI18n } from '@/i18n/I18nProvider'
import type { IOrderStatusHistory } from '@/shared/types/Order.interface'
import { getOrderDriverStatusName, type OrderDriverStatusEnum } from '@/shared/enums/OrderStatus.enum'

type TimelineEvent = {
	id: string
	timeLabel: string
	author: string
	statusFrom: string
	statusTo: string
}

type TimelineSection = {
	id: string
	title: string
	events: TimelineEvent[]
}

export function StatusPage() {
	const { t, locale } = useI18n()
	const { orderStatusHistory, isLoading } = useGetOrderStatusHistory()

	const dateFormatter = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
	const timeFormatter = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
	})

	const timelineSections = buildTimelineSections(orderStatusHistory, {
		t,
		dateFormatter,
		timeFormatter,
	})

	const hasHistory = timelineSections.length > 0

	return (
		<div className='h-full rounded-3xl bg-background p-4 sm:p-6 lg:p-8'>
			{isLoading ? (
				<StatusTimelineSkeleton />
			) : hasHistory ? (
				<div className='space-y-12'>
					{timelineSections.map((section) => (
						<section key={section.id} className='space-y-6'>
							<h2 className='text-lg font-semibold text-foreground sm:text-xl lg:text-2xl'>{section.title}</h2>

							<div className='relative pl-8 sm:pl-12'>
								<span aria-hidden className='absolute left-3 top-4 bottom-6 w-px bg-border sm:left-4' />

								<div className='space-y-8'>
									{section.events.map((event, eventIndex) => {
										const isLastEvent = eventIndex === section.events.length - 1

										return (
											<article
												key={event.id}
												className='relative grid grid-cols-1 items-start gap-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-8'
											>
												<div
													aria-hidden
													className='absolute -left-[27px] top-2 size-4 rounded-full bg-brand/30 sm:-left-[39px]'
												>
													<span className='absolute inset-0 m-auto size-3 rounded-full bg-brand' />
												</div>

												{isLastEvent ? (
													<span
														aria-hidden
														className='pointer-events-none absolute -left-6 top-6 bottom-0 z-10 w-px bg-background sm:-left-8'
													/>
												) : null}

												<div className='text-sm font-medium text-muted-foreground'>{event.timeLabel}</div>

												<div className='rounded-2xl bg-muted px-4 py-4 sm:ml-6 sm:px-6 sm:py-5'>
													<div className='space-y-4'>
														<div className='flex items-center gap-2'>
															<NoPhoto className='size-12 shrink-0' />
															<p className='text-base font-semibold text-foreground'>{event.author}</p>
														</div>

														<p className='text-sm text-muted-foreground'>
															{t('order.status.timeline.changed', {
																from: event.statusFrom,
																to: event.statusTo,
															})}
														</p>
													</div>
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
	)
}

const buildTimelineSections = (
	history: IOrderStatusHistory[] | null | undefined,
	options: {
		t: (key: string, params?: Record<string, string>) => string
		dateFormatter: Intl.DateTimeFormat
		timeFormatter: Intl.DateTimeFormat
	},
): TimelineSection[] => {
	if (!Array.isArray(history) || history.length === 0) {
		return []
	}

	const { t, dateFormatter, timeFormatter } = options

	const parseDate = (value?: string | null) => {
		if (!value) return null
		const parsed = new Date(value)
		return Number.isNaN(parsed.getTime()) ? null : parsed
	}

	const formatSectionTitle = (date: Date | null) => {
		if (!date) return t('order.status.timeline.unknownDate')
		return dateFormatter.format(date)
	}

	const formatTimeLabel = (date: Date | null) => {
		if (!date) return t('order.status.timeline.unknownTime')
		return timeFormatter.format(date)
	}

	const normalizeStatusLabel = (value: string | null | undefined) => {
		return value?.trim() || t('order.status.timeline.notSpecified')
	}

	const getStatusName = (value: string) => {
		const name = getOrderDriverStatusName(t, value as OrderDriverStatusEnum)
		return name || value || t('order.status.timeline.notSpecified')
	}

	const sortedHistory = [...history].sort((first, second) => {
		const firstTimestamp = parseDate(first.created_at)?.getTime() ?? 0
		const secondTimestamp = parseDate(second.created_at)?.getTime() ?? 0
		return secondTimestamp - firstTimestamp
	})

	const sections: TimelineSection[] = []
	const sectionIndexMap = new Map<string, number>()

	for (const item of sortedHistory) {
		const eventDate = parseDate(item.created_at)
		const sectionKey = eventDate ? eventDate.toISOString().slice(0, 10) : `unknown-${item.id}`
		const event: TimelineEvent = {
			id: String(item.id),
			timeLabel: formatTimeLabel(eventDate),
			author: item.user_name?.trim() || t('order.status.timeline.system'),
			statusFrom: normalizeStatusLabel(item.old_status_label),
			statusTo: normalizeStatusLabel(item.new_status_label),
		}

		const existingSectionIndex = sectionIndexMap.get(sectionKey)

		if (existingSectionIndex === undefined) {
			sectionIndexMap.set(sectionKey, sections.length)
			sections.push({
				id: sectionKey,
				title: formatSectionTitle(eventDate),
				events: [event],
			})
		} else {
			sections[existingSectionIndex]?.events.push(event)
		}
	}

	return sections.map((section) => ({
		...section,
		events: section.events.map((event) => ({
			...event,
			statusFrom: getStatusName(event.statusFrom),
			statusTo: getStatusName(event.statusTo),
		})),
	}))
}

function StatusTimelineSkeleton() {
	return (
		<div className='space-y-12'>
			{Array.from({ length: 3 }).map((_, sectionIndex) => (
				<section key={sectionIndex} className='space-y-6'>
					<Skeleton className='h-6 w-52' />
					<div className='relative pl-8 sm:pl-12'>
						<span aria-hidden className='absolute left-3 top-4 bottom-6 w-px bg-border sm:left-4' />
						<div className='space-y-8'>
							{Array.from({ length: 2 }).map((__, eventIndex) => (
								<article
									key={eventIndex}
									className='relative grid grid-cols-1 items-start gap-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-8'
								>
									<div className='absolute -left-[27px] top-2 size-4 rounded-full bg-muted sm:-left-[39px]' />
									<div className='text-sm font-medium text-muted-foreground'>
										<Skeleton className='h-4 w-16' />
									</div>
									<div className='rounded-2xl bg-muted px-4 py-4 sm:ml-6 sm:px-6 sm:py-5'>
										<div className='space-y-3'>
											<div className='flex items-center gap-2'>
												<Skeleton className='size-12 rounded-full' />
												<Skeleton className='h-4 w-40' />
											</div>
											<Skeleton className='h-3 w-64' />
											<Skeleton className='h-3 w-48' />
										</div>
									</div>
								</article>
							))}
						</div>
					</div>
				</section>
			))}
		</div>
	)
}

function EmptyTimelineState() {
	const { t } = useI18n()

	return (
		<div className='flex h-full flex-col items-center justify-center gap-2 text-center'>
			<p className='text-lg font-semibold text-foreground'>{t('order.status.empty.title')}</p>
			<p className='text-sm text-muted-foreground'>
				{t('order.status.empty.description')}
			</p>
		</div>
	)
}
