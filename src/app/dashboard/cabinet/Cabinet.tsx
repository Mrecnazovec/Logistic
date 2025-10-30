'use client'

import { NavInitializer } from "@/components/layouts/dashboard-layout/NavInitializer"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/form-control/Input"
import { Label } from "@/components/ui/form-control/Label"
import { NoPhoto } from "@/components/ui/NoPhoto"
import { Skeleton } from "@/components/ui/Skeleton"
import { DASHBOARD_URL } from "@/config/url.config"
import { useGetMe } from "@/hooks/queries/me/useGetMe"
import { useLogout } from "@/hooks/useLogout"
import Image from "next/image"

export function Cabinet() {
	const { me, isLoading } = useGetMe()
	const { logout, isLoading: isLoadingLogout } = useLogout()

	const navItems = [
		{ label: 'Профиль', href: DASHBOARD_URL.cabinet(), active: true },
	]

	return (
		<div className="h-full flex max-md:flex-col gap-3">
			<NavInitializer items={navItems} />
			<h1 className="sr-only">Профиль пользователя</h1>
			<div className="h-full xl:w-[30%] md:w-1/2 bg-background rounded-4xl py-16 px-4 flex flex-col items-center justify-center gap-6">
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

			<div className="h-full xl:w-[70%] md:w-1/2 bg-background rounded-4xl xs:p-12 p-6 centred">
				<div className="text-center">
					<h2 className="text-brand font-bold text-xl">Аналитика</h2>
					<p>Эта функция появится в ближайших обновлениях</p>
					<p>Следите за новостями!</p>
				</div>
			</div>
		</div>
	)
}
