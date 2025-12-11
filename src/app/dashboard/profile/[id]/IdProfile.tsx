'use client'

import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { RoleSelect } from "@/shared/enums/Role.enum"
import { useGetRatingUser } from "@/hooks/queries/ratings/useGet/useGetRatingUser"
import { CalendarDays, PackageCheck, Star, Truck } from "lucide-react"
import { useParams } from "next/navigation"

const integerFormatter = new Intl.NumberFormat("ru-RU")
const dateFormatter = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" })

const getInitials = (value?: string | null) => value?.trim().charAt(0)?.toUpperCase() || "?"
const parseDistance = (value?: number | string | null) => {
	if (value === null || value === undefined) return null
	const numericValue = typeof value === "string" ? Number(value) : value
	return Number.isFinite(numericValue) ? numericValue : null
}

export function IdProfile() {
	const params = useParams<{ id: string }>()
	const { ratingUser, isLoading } = useGetRatingUser(params?.id)

	const roleLabel = ratingUser ? RoleSelect.find((type) => type.type === ratingUser.role)?.name : ""
	const registeredAt = ratingUser?.registered_at ? dateFormatter.format(new Date(ratingUser.registered_at)) : "-"
	const completedOrders = parseDistance(ratingUser?.completed_orders)

	const stats = [
		{
			id: "rating",
			label: "Рейтинг",
			value: ratingUser?.avg_rating ? ratingUser.avg_rating.toFixed(1) : "-",
			sub: ratingUser ? `${integerFormatter.format(ratingUser.rating_count)} отзывов` : "",
			icon: Star,
		},
		{
			id: "orders",
			label: "Завершенных сделок",
			value: completedOrders !== null ? integerFormatter.format(completedOrders) : "-",
			sub: "за всё время",
			icon: PackageCheck,
		},
		{
			id: "distance",
			label: "Пройдено расстояния",
			value: (() => {
				const totalDistance = parseDistance(ratingUser?.total_distance)
				return totalDistance !== null ? `${integerFormatter.format(Math.round(totalDistance))} км` : "-"
			})(),
			sub: "по данным сделкам",
			icon: Truck,
		},
		{
			id: "registered",
			label: "Зарегистрирован",
			value: registeredAt,
			sub: ratingUser ? ratingUser.country : "",
			icon: CalendarDays,
		},
	]

	if (isLoading) {
		return (
			<div className="space-y-6">
				<Card className="rounded-[28px] border-border/50 px-6 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
					<div className="flex items-start gap-4">
						<Skeleton className="size-16 rounded-full" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-5 w-40 rounded-full" />
							<Skeleton className="h-4 w-32 rounded-full" />
							<Skeleton className="h-4 w-24 rounded-full" />
						</div>
					</div>
				</Card>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 4 }).map((_, index) => (
						<Card key={index} className="rounded-[24px] border-border/40 px-5 py-5 shadow-sm">
							<Skeleton className="h-4 w-24 rounded-full" />
							<Skeleton className="mt-3 h-6 w-20 rounded-full" />
							<Skeleton className="mt-2 h-3 w-28 rounded-full" />
						</Card>
					))}
				</div>
			</div>
		)
	}

	if (!ratingUser) {
		return (
			<Card className="rounded-[28px] border-border/50 px-6 py-8 text-center text-muted-foreground shadow-sm">
				Данные по пользователю не найдены
			</Card>
		)
	}

	return (
		<div className="space-y-6">
			<Card className="rounded-[28px] border-border/50 px-6 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
				<div className="flex flex-wrap items-start gap-4">
					<div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-blue-200 text-lg font-bold text-sky-700">
						{getInitials(ratingUser.display_name)}
					</div>
					<div className="space-y-1">
						<p className="text-xl font-semibold text-foreground">{ratingUser.display_name}</p>
						<p className="text-sm text-muted-foreground">{ratingUser.company_name}</p>
						<div className="text-sm text-muted-foreground">{roleLabel}</div>
					</div>
				</div>
			</Card>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((item) => (
					<Card key={item.id} className="flex flex-col gap-3 rounded-[24px] border-border/40 px-5 py-5 shadow-sm">
						<div className="flex items-start justify-between gap-3">
							<div>
								<p className="text-sm text-muted-foreground">{item.label}</p>
								<p className="text-2xl font-semibold text-foreground">{item.value}</p>
							</div>
							<div className="flex size-11 items-center justify-center rounded-full bg-sky-50 text-sky-600">
								<item.icon className="size-5" />
							</div>
						</div>
						{item.sub ? <p className="text-sm text-muted-foreground">{item.sub}</p> : null}
					</Card>
				))}
			</div>
		</div>
	)
}

