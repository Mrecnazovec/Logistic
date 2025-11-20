'use client'

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/form-control/Input"
import { Label } from "@/components/ui/form-control/Label"
import { NoPhoto } from "@/components/ui/NoPhoto"
import { Skeleton } from "@/components/ui/Skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useGetAnalytics } from "@/hooks/queries/me/useGetAnalytics"
import { useGetMe } from "@/hooks/queries/me/useGetMe"
import { useLogout } from "@/hooks/useLogout"
import type { LucideIcon } from "lucide-react"
import { BarChart3, BusFront, DoorOpen, PackageCheck, Star } from "lucide-react"
import Image from "next/image"
import { useMemo } from "react"
import type { CSSProperties } from "react"

type AnalyticsCard = {
	id: string
	title: string
	value: string
	icon: LucideIcon
	accentClass: string
	trend?: string
	trendVariant?: "success" | "danger"
	description?: string
}

type OrdersStats = {
	total: string
	successful: string
	cancelled: string
	successPercentLabel: string
	donutStyle: CSSProperties
	legend: { id: string; label: string; color: string; value: string }[]
}

const integerFormatter = new Intl.NumberFormat("ru-RU")
const decimalFormatter = new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const fullDateFormatter = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" })

const formatTrend = (value?: number | null) => {
	if (typeof value !== "number") return undefined
	const normalized = Math.abs(value) < 1 && value !== 0 ? value * 100 : value
	const absoluteValue = Math.abs(normalized)

	if (absoluteValue === 0) {
		return "0%"
	}

	const sign = normalized > 0 ? "+" : "-"
	return `${sign}${decimalFormatter.format(absoluteValue)}%`
}

const analyticsFilters = [
	{ value: "current", label: "Этот месяц", indicatorClass: "bg-emerald-500" },
	{ value: "previous", label: "Прошлый месяц" },
	{ value: "custom", label: "Выбрать период" },
]

export function Cabinet() {
	const { me, isLoading } = useGetMe()
	const { logout, isLoading: isLoadingLogout } = useLogout()
	const { analytics, isLoading: isLoadingAnalytics } = useGetAnalytics()

	const { shipmentCard, detailCards, ordersStats } = useMemo<{
		shipmentCard: AnalyticsCard
		detailCards: AnalyticsCard[]
		ordersStats: OrdersStats
	}>(() => {
		const fallbackValue = "-"
		const successfulDeliveries = analytics?.successful_deliveries ?? 0
		const formattedSuccess = analytics ? integerFormatter.format(successfulDeliveries) : fallbackValue
		const registrationValue = analytics ? fullDateFormatter.format(new Date(analytics.registered_since)) : fallbackValue
		const ratingValue = analytics ? decimalFormatter.format(analytics.rating) : fallbackValue
		const distanceValue = analytics ? `${integerFormatter.format(Math.round(analytics.distance_km))} км` : fallbackValue
		const dealsCount = analytics?.deals_count ?? 0
		const dealsValue = analytics ? integerFormatter.format(dealsCount) : fallbackValue
		const cancelledDeliveries = Math.max(dealsCount - successfulDeliveries, 0)
		const successPercent = dealsCount ? Math.round((successfulDeliveries / dealsCount) * 100) : 0
		const donutStyle: CSSProperties = dealsCount
			? {
					backgroundImage: `conic-gradient(#10b981 0% ${successPercent}%, #f43f5e ${successPercent}% 100%)`,
			  }
			: {
					backgroundImage: "conic-gradient(#e2e8f0 0% 100%)",
			  }

		const shipmentCard: AnalyticsCard = {
			id: "shipments",
			title: "Успешные перевозки",
			value: formattedSuccess,
			trend: formatTrend(analytics?.successful_deliveries_change),
			trendVariant: (analytics?.successful_deliveries_change ?? 0) < 0 ? "danger" : "success",
			description: analytics ? `Всего за месяц: ${formattedSuccess}` : undefined,
			icon: PackageCheck,
			accentClass: "text-sky-600 bg-sky-100",
		}

		const detailCards: AnalyticsCard[] = [
			{
				id: "registration",
				title: "Зарегистрирован с",
				value: registrationValue,
				description: analytics ? `${analytics.days_since_registered} дней` : undefined,
				icon: DoorOpen,
				accentClass: "text-indigo-600 bg-indigo-100",
			},
			{
				id: "rating",
				title: "Рейтинг",
				value: ratingValue,
				description: analytics ? `На основе ${integerFormatter.format(dealsCount)} сделок` : undefined,
				icon: Star,
				accentClass: "text-amber-500 bg-amber-50",
			},
			{
				id: "distance",
				title: "Пройдено расстояния",
				value: distanceValue,
				description: analytics ? `За ${integerFormatter.format(dealsCount)} сделок` : undefined,
				icon: BusFront,
				accentClass: "text-blue-700 bg-blue-100",
			},
			{
				id: "deals",
				title: "Всего сделок",
				value: dealsValue,
				description: analytics
					? `Успешно ${integerFormatter.format(successfulDeliveries)} доставок`
					: undefined,
				icon: BarChart3,
				accentClass: "text-brand bg-brand/10",
			},
		]

		const ordersStats: OrdersStats = {
			total: integerFormatter.format(dealsCount),
			successful: integerFormatter.format(successfulDeliveries),
			cancelled: integerFormatter.format(cancelledDeliveries),
			successPercentLabel: `${successPercent}%`,
			donutStyle,
			legend: [
				{ id: "total", label: "Заказы", color: "bg-blue-500", value: integerFormatter.format(dealsCount) },
				{ id: "success", label: "Успешные", color: "bg-emerald-500", value: integerFormatter.format(successfulDeliveries) },
				{ id: "cancelled", label: "Отмененные", color: "bg-rose-500", value: integerFormatter.format(cancelledDeliveries) },
			],
		}

		return { shipmentCard, detailCards, ordersStats }
	}, [analytics])

	const profileFields = useMemo(
		() => [
			{ id: "full-name", label: "Ф.И.О.", value: me?.first_name || me?.company_name || me?.email || "" },
			{ id: "email", label: "Email", value: me?.email || "" },
			{ id: "phone", label: "Номер телефона", value: me?.phone || "" },
			{ id: "company", label: "Название компании", value: me?.company_name || "" },
			{ id: "country", label: "Страна", value: me?.profile?.country || "" },
			{ id: "city", label: "Город", value: me?.profile?.city || "" },
		],
		[me],
	)

	return (
		<div className="flex h-full gap-3 max-lg:flex-col">
			<h1 className="sr-only">Личный кабинет</h1>
			<div className="flex h-full flex-col items-center justify-center gap-6 rounded-4xl bg-background px-4 py-16 lg:w-1/2 xl:w-[30%]">
				<div className="centred flex-col gap-3 text-center">
					{isLoading ? (
						<>
							<Skeleton className="size-24 rounded-full" />
							<Skeleton className="h-3 w-28 rounded-full" />
							<Skeleton className="h-8 w-36 rounded-full" />
						</>
					) : (
						<>
							{me?.photo ? (
								<Image
									src={me.photo}
									alt="Фото профиля"
									width={96}
									height={96}
									className="size-24 rounded-full object-cover"
								/>
							) : (
								<NoPhoto className="size-24" />
							)}
							<p className="text-sm font-semibold text-muted-foreground">{me?.company_name}</p>
							<p className="text-lg font-semibold">{me?.first_name || me?.email}</p>
							<Button
								onClick={() => logout("")}
								variant="destructive"
								size="sm"
								className="rounded-4xl px-5"
								disabled={isLoadingLogout}
							>
								Выйти из аккаунта
							</Button>
						</>
					)}
				</div>

				<div className="mt-8 w-full space-y-5">
					{profileFields.map((field) => (
						<div key={field.id} className="space-y-2">
							<Label className="text-sm text-muted-foreground" htmlFor={field.id}>
								{field.label}
							</Label>
							{isLoading ? (
								<Skeleton className="h-11 w-full rounded-3xl" />
							) : (
								<Input
									disabled
									value={field.value}
									id={field.id}
									className="disabled:opacity-100"
									placeholder={field.label}
								/>
							)}
						</div>
					))}
				</div>
			</div>

			<div className="flex h-full flex-col gap-6 rounded-4xl bg-background p-6 xs:p-12 lg:w-1/2 xl:w-[70%]">
				<div className="flex flex-col gap-2">
					<h2 className="text-xl font-bold text-brand">Аналитика</h2>
					<p className="text-sm text-muted-foreground">
						Следите за ключевыми показателями, чтобы понимать динамику вашего бизнеса и реагировать вовремя.
					</p>
				</div>

				<Tabs defaultValue="current" className="flex flex-col gap-6">
					<TabsList className="flex h-auto flex-wrap gap-2 rounded-3xl bg-transparent p-1">
						{analyticsFilters.map((filter) => (
							<TabsTrigger
								key={filter.value}
								value={filter.value}
								className="h-10 rounded-full px-4 text-sm font-medium data-[state=active]:border data-[state=active]:border-brand/40 data-[state=active]:bg-white data-[state=active]:text-foreground"
							>
								<span className="flex items-center gap-2">
									{filter.indicatorClass ? (
										<span className={`size-2 rounded-full ${filter.indicatorClass}`} aria-hidden="true" />
									) : null}
									{filter.label}
								</span>
							</TabsTrigger>
						))}
					</TabsList>

					{analyticsFilters.map((filter) => (
						<TabsContent key={filter.value} value={filter.value} className="flex-1">
							<div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
								<div className="space-y-6">
									<Card className="rounded-[28px] border-border/40 px-6 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
										<div className="flex flex-wrap items-start justify-between gap-4">
											<div className="space-y-2">
												<p className="text-sm text-muted-foreground">{shipmentCard.title}</p>
												{isLoadingAnalytics ? (
													<Skeleton className="h-11 w-32 rounded-3xl" />
												) : (
													<p className="text-4xl font-semibold tracking-tight">{shipmentCard.value}</p>
												)}
											</div>
											<div
												className={`flex size-14 items-center justify-center rounded-full ${shipmentCard.accentClass}`}
											>
												<shipmentCard.icon className="size-6" />
											</div>
										</div>
										<div className="mt-6 flex flex-wrap items-center gap-4">
											{isLoadingAnalytics ? (
												<Skeleton className="h-7 w-32 rounded-full" />
											) : shipmentCard.trend ? (
												<Badge
													variant={shipmentCard.trendVariant === "danger" ? "danger" : "success"}
													className="before:hidden px-3 py-1 text-xs"
												>
													{shipmentCard.trend} с прошлого месяца
												</Badge>
											) : null}
											{isLoadingAnalytics ? (
												<Skeleton className="h-4 w-40 rounded-full" />
											) : shipmentCard.description ? (
												<p className="text-sm text-muted-foreground">{shipmentCard.description}</p>
											) : null}
										</div>
									</Card>

									<Card className="rounded-[28px] border-border/40 px-6 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
										{isLoadingAnalytics ? (
											<div className="flex flex-col gap-4">
												<Skeleton className="h-4 w-32 rounded-full" />
												<Skeleton className="h-9 w-48 rounded-2xl" />
												<Skeleton className="h-32 w-full rounded-3xl" />
											</div>
										) : (
											<div className="space-y-6">
												<div className="space-y-2">
													<p className="text-sm text-muted-foreground">Статистика заказов</p>
													<p className="text-lg font-semibold">Успешность {ordersStats.successPercentLabel}</p>
												</div>
												<div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
													<div
														className="relative size-40 rounded-full p-3"
														style={ordersStats.donutStyle}
														aria-hidden="true"
													>
														<div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-background shadow-inner">
															<span className="text-3xl font-semibold">{ordersStats.total}</span>
															<span className="text-sm text-muted-foreground">заказы</span>
														</div>
													</div>
													<div className="w-full space-y-3 sm:max-w-[220px]">
														{ordersStats.legend.map((item) => (
															<div key={item.id} className="flex items-center justify-between text-sm font-medium">
																<span className="flex items-center gap-2 text-muted-foreground">
																	<span className={`size-2.5 rounded-full ${item.color}`} aria-hidden="true" />
																	{item.label}
																</span>
																<span className="font-semibold text-foreground">{item.value}</span>
															</div>
														))}
													</div>
												</div>
											</div>
										)}
									</Card>
								</div>

								<div className="grid gap-4 sm:grid-cols-2">
									{detailCards.map((card) => (
										<Card
											key={`${filter.value}-${card.id}`}
											className="rounded-[28px] border-border/40 px-6 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
										>
											<div className="flex items-start justify-between gap-4">
												<div className="space-y-1.5">
													<p className="text-sm text-muted-foreground">{card.title}</p>
													{isLoadingAnalytics ? (
														<Skeleton className="h-9 w-24 rounded-2xl" />
													) : (
														<p className="text-2xl font-semibold">{card.value}</p>
													)}
												</div>
												<div className={`flex size-11 items-center justify-center rounded-full ${card.accentClass}`}>
													<card.icon className="size-5" />
												</div>
											</div>
											<div className="mt-4">
												{isLoadingAnalytics ? (
													<Skeleton className="h-4 w-28 rounded-full" />
												) : card.description ? (
													<p className="text-sm text-muted-foreground">{card.description}</p>
												) : null}
											</div>
										</Card>
									))}
								</div>
							</div>
						</TabsContent>
					))}
				</Tabs>
			</div>
		</div>
	)
}
