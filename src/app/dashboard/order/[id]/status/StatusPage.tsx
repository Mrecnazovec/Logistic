"use client"

import { useMemo } from "react"

import { NoPhoto } from "@/components/ui/NoPhoto"
import { Skeleton } from "@/components/ui/Skeleton"
import { useGetOrderStatusHistory } from "@/hooks/queries/orders/useGet/useGetOrderStatusHistory"
import type { IOrderStatusHistory } from "@/shared/types/Order.interface"
import { OrderDriverStatusSelector } from "@/shared/enums/OrderStatus.enum"

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

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
	day: "numeric",
	month: "long",
	year: "numeric",
})

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
	hour: "2-digit",
	minute: "2-digit",
})

export function StatusPage() {
	const { orderStatusHistory, isLoading } = useGetOrderStatusHistory()

	const timelineSections = useMemo(
		() => buildTimelineSections(orderStatusHistory),
		[orderStatusHistory],
	)

	const hasHistory = timelineSections.length > 0

	return (
		<div className="h-full rounded-3xl bg-background p-8">
			{isLoading ? (
				<StatusTimelineSkeleton />
			) : hasHistory ? (
				<div className="space-y-12">
					{timelineSections.map((section) => (
						<section key={section.id} className="space-y-6">
							<h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>

							<div className="relative pl-12">
								<span aria-hidden className="absolute left-4 top-4 bottom-6 w-px bg-border" />

								<div className="space-y-8">
									{section.events.map((event, eventIndex) => {
										const isLastEvent = eventIndex === section.events.length - 1

										return (
											<article
												key={event.id}
												className="relative grid grid-cols-[120px_minmax(0,1fr)] items-start gap-8"
											>
												<div
													aria-hidden
													className="absolute -left-[39px] top-2 size-4 rounded-full bg-brand/30"
												>
													<span className="absolute inset-0 m-auto size-3 rounded-full bg-brand" />
												</div>

												{isLastEvent ? (
													<span
														aria-hidden
														className="pointer-events-none absolute -left-8 top-6 bottom-0 z-10 w-px bg-background"
													/>
												) : null}

												<div className="text-sm font-medium text-muted-foreground">{event.timeLabel}</div>

												<div className="ml-6 rounded-2xl bg-muted px-6 py-5">
													<div className="space-y-4">
														<div className="flex items-center gap-2">
															<NoPhoto className="size-12 shrink-0" />
															<p className="text-base font-semibold text-foreground">{event.author}</p>
														</div>

														<p className="text-sm text-muted-foreground">
															Статус изменён с &quot;
															<span className="font-semibold text-foreground">{OrderDriverStatusSelector.find((t) => t.type === event.statusFrom)?.name}</span>&quot; на
															&quot;<span className="font-semibold text-foreground">{OrderDriverStatusSelector.find((t) => t.type === event.statusTo)?.name}</span>&quot;
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

const buildTimelineSections = (history?: IOrderStatusHistory[] | null): TimelineSection[] => {
	if (!Array.isArray(history) || history.length === 0) {
		return []
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
			author: item.user_name?.trim() || "System",
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

	return sections
}

const parseDate = (value?: string | null) => {
	if (!value) return null
	const parsed = new Date(value)
	return Number.isNaN(parsed.getTime()) ? null : parsed
}

const formatSectionTitle = (date: Date | null) => {
	if (!date) return "Unknown date"
	return dateFormatter.format(date)
}

const formatTimeLabel = (date: Date | null) => {
	if (!date) return "--:--"
	return timeFormatter.format(date)
}

const normalizeStatusLabel = (value?: string | null) => {
	return value?.trim() || "Not specified"
}

function StatusTimelineSkeleton() {
	return (
		<div className="space-y-12">
			{Array.from({ length: 3 }).map((_, sectionIndex) => (
				<section key={sectionIndex} className="space-y-6">
					<Skeleton className="h-6 w-52" />
					<div className="relative pl-12">
						<span aria-hidden className="absolute left-4 top-4 bottom-6 w-px bg-border" />
						<div className="space-y-8">
							{Array.from({ length: 2 }).map((__, eventIndex) => (
								<article
									key={eventIndex}
									className="relative grid grid-cols-[120px_minmax(0,1fr)] items-start gap-8"
								>
									<div className="absolute -left-[39px] top-2 size-4 rounded-full bg-muted" />
									<div className="text-sm font-medium text-muted-foreground">
										<Skeleton className="h-4 w-16" />
									</div>
									<div className="ml-6 rounded-2xl bg-muted px-6 py-5">
										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<Skeleton className="size-12 rounded-full" />
												<Skeleton className="h-4 w-40" />
											</div>
											<Skeleton className="h-3 w-64" />
											<Skeleton className="h-3 w-48" />
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
	return (
		<div className="flex h-full flex-col items-center justify-center gap-2 text-center">
			<p className="text-lg font-semibold text-foreground">Статусы пока не обновлялись</p>
			<p className="text-sm text-muted-foreground">
				История статусов отображается изменения статусов.
			</p>
		</div>
	)
}
