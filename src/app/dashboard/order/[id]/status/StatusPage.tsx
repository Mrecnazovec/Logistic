"use client"

import { NoPhoto } from "@/components/ui/NoPhoto"

type TimelineEvent = {
	id: string
	timeLabel: string
	author: string
	statusFrom: string
	statusTo: string
	note?: string
}

type TimelineSection = {
	id: string
	title: string
	events: TimelineEvent[]
}

const timelineSections: TimelineSection[] = [
	{
		id: "today",
		title: "Сегодня",
		events: [
			{
				id: "today-1",
				timeLabel: "12 минут назад",
				author: "Radzhalb Iskanderov",
				statusFrom: "Остановился",
				statusTo: "В пути",
			},
			{
				id: "today-2",
				timeLabel: "12 минут назад",
				author: "Radzhalb Iskanderov",
				statusFrom: "В пути",
				statusTo: "Остановился",
			},
			{
				id: "today-3",
				timeLabel: "12 минут назад",
				author: "Radzhalb Iskanderov",
				statusFrom: "Остановился",
				statusTo: "В пути",
			},
		],
	},
	{
		id: "aug-24",
		title: "Понедельник, 24 августа, 2025",
		events: [
			{
				id: "aug-24-1",
				timeLabel: "23:25",
				author: "Radzhalb Iskanderov",
				statusFrom: "Остановился",
				statusTo: "В пути",
			},
			{
				id: "aug-24-2",
				timeLabel: "17:21",
				author: "Radzhalb Iskanderov",
				statusFrom: "В пути",
				statusTo: "Остановился",
				note: "Пользователь подтвердил выгрузку и попросил связаться повторно через 30 минут.",
			},
			{
				id: "aug-24-3",
				timeLabel: "12:00",
				author: "Radzhalb Iskanderov",
				statusFrom: "Остановился",
				statusTo: "В пути",
			},
			{
				id: "aug-24-4",
				timeLabel: "17:21",
				author: "Radzhalb Iskanderov",
				statusFrom: "В пути",
				statusTo: "Остановился",
				note: "Пользователь подтвердил выгрузку и попросил связаться повторно через 30 минут.",
			},
			{
				id: "aug-24-5",
				timeLabel: "12:00",
				author: "Radzhalb Iskanderov",
				statusFrom: "Остановился",
				statusTo: "В пути",
			},
		],
	},
] satisfies TimelineSection[]

export function StatusPage() {
	return (
		<div className="h-full rounded-3xl bg-background p-8">
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
													className="pointer-events-none absolute -left-8 top-6 bottom-0 w-px bg-background z-10"
												/>
											) : null}

											<div className="text-sm font-medium text-muted-foreground">{event.timeLabel}</div>

											<div className="ml-6 px-6 py-5 bg-neutral-500 rounded-2xl">
												<div className="space-y-4">
													<div className="flex items-center gap-2"><NoPhoto className="size-12 shrink-0" />

														<p className="text-base font-semibold text-foreground">{event.author}</p></div>

													<p className="text-sm text-muted-foreground">
														Пользователь поменял свой статус на <span className="font-semibold text-foreground">"
															{event.statusTo}"</span> с <span className="font-semibold text-foreground">"
															{event.statusFrom}"</span>
													</p>

													{event.note ? (
														<p className="text-sm text-muted-foreground/90">{event.note}</p>
													) : null}
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
		</div>
	)
}
