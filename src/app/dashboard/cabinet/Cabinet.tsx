'use client'

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/form-control/Input"
import { Label } from "@/components/ui/form-control/Label"
import { NoPhoto } from "@/components/ui/NoPhoto"
import { Skeleton } from "@/components/ui/Skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useGetMe } from "@/hooks/queries/me/useGetMe"
import { useLogout } from "@/hooks/useLogout"
import type { LucideIcon } from "lucide-react"
import { BusFront, DoorOpen, PackageCheck, Star } from "lucide-react"
import Image from "next/image"

type AnalyticsCard = {
	id: string
	title: string
	value: string
	icon: LucideIcon
	accentClass: string
	trend?: string
	description?: string
}

const analyticsCards: AnalyticsCard[] = [
	{
		id: "shipments",
		title: "Успешные перевозки",
		value: "1 431",
		trend: "+13%",
		description: "с прошлого месяца",
		icon: PackageCheck,
		accentClass: "text-sky-600 bg-sky-100",
	},
	{
		id: "registration",
		title: "Зарегистрирован с",
		value: "8 мая 2025 г.",
		description: "472 дня",
		icon: DoorOpen,
		accentClass: "text-indigo-600 bg-indigo-100",
	},
	{
		id: "rating",
		title: "Рейтинг",
		value: "4.5",
		trend: "+13%",
		description: "с прошлого месяца",
		icon: Star,
		accentClass: "text-amber-500 bg-amber-50",
	},
	{
		id: "distance",
		title: "Пройдено расстояния",
		value: "7 200 км",
		description: "за 128 сделок",
		icon: BusFront,
		accentClass: "text-blue-700 bg-blue-100",
	},
]

const analyticsFilters = [
	{ value: "current", label: "Этот месяц", indicatorClass: "bg-emerald-500" },
	{ value: "previous", label: "Прошлый месяц" },
	{ value: "custom", label: "Выбрать период" },
]

export function Cabinet() {
	const { me, isLoading } = useGetMe()
	const { logout, isLoading: isLoadingLogout } = useLogout()


	return (
		<div className="h-full flex max-lg:flex-col gap-3">
			<h1 className="sr-only">Профиль пользователя</h1>
			<div className="h-full xl:w-[30%] lg:w-1/2 bg-background rounded-4xl py-16 px-4 flex flex-col items-center justify-center gap-6">
				<div className="centred flex-col gap-3">
					{isLoading ? (
						<>
							<Skeleton className="size-24 rounded-full" />
							<Skeleton className="w-32 h-[12px]" />
							<Skeleton className="h-8 w-[149px]" />
						</>
					) : (
						<>
							{me?.photo ? (
								<Image
									src={me.photo}
									alt="Фото профиля"
									width={96}
									height={96}
									className="rounded-full object-cover size-24"
								/>
							) : (
								<NoPhoto className="size-24" />
							)}
							<p className="font-bold text-xs text-center">
								{me?.company_name || me?.first_name || me?.email}
							</p>
							<Button
								onClick={() => logout('')}
								variant="destructive"
								size="sm"
								className="rounded-4xl"
								disabled={isLoadingLogout}
							>
								Выйти из аккаунта
							</Button>
						</>
					)}
				</div>

				<div className="w-full space-y-6 mt-8">
					{[
						{ id: "email", label: "Email", value: me?.email },
						{ id: "phone", label: "Номер телефона", value: me?.phone },
						{ id: "company", label: "Название компании", value: me?.company_name },
						{ id: "country", label: "Страна", value: me?.profile.country },
						{ id: "city", label: "Город", value: me?.profile.city },
						{ id: "created-at", label: "Зарегистрирован с", value: me?.id },
					].map((field) => (
						<div key={field.id}>
							<Label className="text-sm text-grayscale" htmlFor={field.id}>
								{field.label}
							</Label>
							{isLoading ? (
								<Skeleton className="h-11 w-full rounded-4xl" />
							) : (
								<Input
									disabled
									value={field.value || ''}
									className="disabled:opacity-100"
									id={field.id}
								/>
							)}
						</div>
					))}
				</div>
			</div>

			<div className="h-full xl:w-[70%] lg:w-1/2 bg-background rounded-4xl xs:p-12 p-6 flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<h2 className="text-brand font-bold text-xl">Аналитика</h2>
					<p className="text-sm text-muted-foreground">
						Краткая сводка по активности пользователя за выбранный период.
					</p>
				</div>

				<Tabs defaultValue="current" className="flex flex-col gap-6">
					<TabsList className="bg-transparent  xl:rounded-full rounded-3xl h-auto gap-1 px-1 py-1 max-xl:flex-col max-xl:w-full">
						{analyticsFilters.map((filter) => (
							<TabsTrigger
								key={filter.value}
								value={filter.value}
								className="rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:border data-[state=active]:border-brand/40 h-fit max-xl:w-full"
							>
								<span className="flex items-center gap-2">
									{filter.indicatorClass ? (
										<span
											className={`size-2 rounded-full ${filter.indicatorClass}`}
											aria-hidden="true"
										/>
									) : null}
									{filter.label}
								</span>
							</TabsTrigger>
						))}
					</TabsList>

					{analyticsFilters.map((filter) => (
						<TabsContent key={filter.value} value={filter.value} className="flex-1">
							<div className="grid gap-4 md:gap-6 xl:grid-cols-2">
								{analyticsCards.map((card) => (
									<Card
										key={`${filter.value}-${card.id}`}
										className="rounded-[28px] border-border/40 px-6 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
									>
										<div className="flex items-start justify-between gap-4">
											<div className="space-y-2">
												<p className="text-sm text-muted-foreground">{card.title}</p>
												<p className="text-3xl font-bold tracking-tight text-foreground">
													{card.value}
												</p>
											</div>
											<div
												className={`size-12 rounded-full flex items-center justify-center ${card.accentClass}`}
											>
												<card.icon className="size-5" />
											</div>
										</div>
										<div className="mt-4 space-y-2">
											{card.trend ? (
												<Badge className="before:hidden bg-emerald-50 text-emerald-600">
													{card.trend}
												</Badge>
											) : null}
											{card.description ? (
												<p className="text-sm text-muted-foreground">{card.description}</p>
											) : null}
										</div>
									</Card>
								))}
							</div>
						</TabsContent>
					))}
				</Tabs>
			</div>
		</div>
	)
}
