"use client"

import { useEffect, useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/form-control/Input"
import { Label } from "@/components/ui/form-control/Label"
import { CitySelector } from "@/components/ui/selectors/CitySelector"
import { CountrySelector } from "@/components/ui/selectors/CountrySelector"
import { useGetMe } from "@/hooks/queries/me/useGetMe"
import { useUpdateMe } from "@/hooks/queries/me/useUpdateMe"
import { type UpdateMeDto } from "@/shared/types/Me.interface"
import { type Country } from "@/shared/types/Geo.interface"

const toPayload = (values: UpdateMeDto): UpdateMeDto => ({
	first_name: values.first_name?.trim() || undefined,
	company_name: values.company_name?.trim() || undefined,
	phone: values.phone?.trim() || undefined,
	profile: {
		country: values.profile?.country?.trim() || undefined,
		city: values.profile?.city?.trim() || undefined,
		// preserve other profile fields if backend supports partial updates
		region: values.profile?.region,
		country_code: values.profile?.country_code,
	},
})

export function SettingPage() {
	const { me, isLoading } = useGetMe()
	const { updateMe, isLoadingUpdate } = useUpdateMe()

	const { register, handleSubmit, reset, setValue, control } = useForm<UpdateMeDto>({
		defaultValues: {
			first_name: "",
			company_name: "",
			phone: "",
			profile: {
				country: "",
				country_code: "",
				city: "",
			},
		},
	})

	const watchedCountryCode = useWatch({ control, name: "profile.country_code" })
	const watchedCity = useWatch({ control, name: "profile.city" }) || ""
	const watchedCountryName = useWatch({ control, name: "profile.country" }) || ""

	const selectedCountry: Country | null = useMemo(
		() => (watchedCountryName && watchedCountryCode ? { name: watchedCountryName, code: watchedCountryCode } : null),
		[watchedCountryCode, watchedCountryName],
	)

	useEffect(() => {
		if (!me) return

		reset({
			first_name: me.first_name ?? "",
			company_name: me.company_name ?? "",
			phone: me.phone ?? "",
			profile: {
				country: me.profile?.country ?? "",
				country_code: me.profile?.country_code ?? "",
				city: me.profile?.city ?? "",
				region: me.profile?.region,
			},
		})
	}, [me, reset])

	const onSubmit = handleSubmit((values) => {
		updateMe(toPayload(values))
	})

	return (
		<form onSubmit={onSubmit} className="rounded-[32px] bg-white p-6 shadow-sm md:p-8">
			<div className="space-y-1">
				<h1 className="text-xl font-semibold text-foreground md:text-2xl">Настройки аккаунта</h1>
				<p className="text-sm text-muted-foreground">
					Просматривайте и обновляйте данные своей учетной записи, профиль и многое другое.
				</p>
			</div>

			<div className="mt-8 space-y-6">
				<div className="grid gap-5 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="fullName" className="text-sm font-medium text-foreground">
							Ф.И.О.
						</Label>
						<Input
							id="fullName"
							placeholder="Ф.И.О."
							disabled={isLoading || isLoadingUpdate}
							className="rounded-full bg-grayscale-50 text-[15px] placeholder:text-muted-foreground/80"
							{...register("first_name")}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="companyName" className="text-sm font-medium text-foreground">
							Название компании
						</Label>
						<Input
							id="companyName"
							placeholder="Название компании"
							disabled={isLoading || isLoadingUpdate}
							className="rounded-full bg-grayscale-50 text-[15px] placeholder:text-muted-foreground/80"
							{...register("company_name")}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email" className="text-sm font-medium text-foreground">
							Email
						</Label>
						<Input
							id="email"
							placeholder="Email"
							value={me?.email ?? ""}
							disabled
							className="rounded-full bg-grayscale-50 text-[15px] placeholder:text-muted-foreground/80 disabled:opacity-100"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="country" className="text-sm font-medium text-foreground">
							Страна
						</Label>
						<CountrySelector
							value={selectedCountry}
							onChange={(country) => {
								setValue("profile.country", country.name)
								setValue("profile.country_code", country.code)
								setValue("profile.city", "")
							}}
							disabled={isLoading || isLoadingUpdate}
							placeholder="Страна"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="phone" className="text-sm font-medium text-foreground">
							Номер телефона
						</Label>
						<Input
							id="phone"
							placeholder="Номер телефона"
							disabled={isLoading || isLoadingUpdate}
							className="rounded-full bg-grayscale-50 text-[15px] placeholder:text-muted-foreground/80"
							{...register("phone")}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="city" className="text-sm font-medium text-foreground">
							Город
						</Label>
						<CitySelector
							value={watchedCity}
							onChange={(value, city) => {
								setValue("profile.city", value)
								if (city?.country_code) {
									setValue("profile.country", city.country)
									setValue("profile.country_code", city.country_code)
								}
							}}
							countryCode={watchedCountryCode || undefined}
							disabled={isLoading || isLoadingUpdate}
							placeholder="Город"
						/>
					</div>
				</div>

				<div className="flex justify-end">
					<Button
						type="submit"
						disabled={isLoadingUpdate}
						className="h-11 rounded-full bg-[#8A9099] px-6 text-sm font-medium text-white hover:bg-[#7a808a] disabled:opacity-80"
					>
						Сохранить изменения
					</Button>
				</div>
			</div>
		</form>
	)
}
