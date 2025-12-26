"use client"

import { Button } from "@/components/ui/Button"
import { languageOptions } from "@/i18n/languages"
import { useI18n } from "@/i18n/I18nProvider"
import { useLocaleSwitcher } from "@/i18n/useLocaleSwitcher"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useEffect, useState } from "react"

export function LanguagePage() {
	const { locale, t } = useI18n()
	const { switchLocale } = useLocaleSwitcher()
	const [pendingLocale, setPendingLocale] = useState(locale)

	useEffect(() => {
		setPendingLocale(locale)
	}, [locale])

	const handleSave = () => {
		if (pendingLocale !== locale) {
			switchLocale(pendingLocale)
		}
	}

	return (
		<div className="rounded-[32px] bg-white p-6 shadow-sm md:p-8">
			<div className="space-y-1">
				<h1 className="text-xl font-semibold text-foreground md:text-2xl">{t("settings.language.title")}</h1>
				<p className="text-sm text-muted-foreground">{t("settings.language.description")}</p>
			</div>

			<div className="mt-8 space-y-4">
				<div className="space-y-3 rounded-3xl border border-transparent bg-white px-2 py-1 shadow-[0_1px_6px_rgba(15,23,42,0.04)]">
					{languageOptions.map((language) => {
						const isActive = pendingLocale === language.code
						return (
							<button
								key={language.code}
								type="button"
								onClick={() => setPendingLocale(language.code)}
								className={cn(
									"flex w-full items-center justify-between rounded-full px-4 py-3 text-left transition",
									isActive ? "bg-grayscale-50 shadow-xs" : "hover:bg-grayscale-50/70"
								)}
							>
								<span className="flex items-center gap-3 text-[15px] font-medium text-foreground">
									<Image src={language.flag} alt={language.label} width={28} height={20} className="rounded-sm" />
									{language.label}
								</span>
								<span
									className={cn(
										"size-3.5 rounded-full border border-muted-foreground/40 transition",
										isActive && "border-brand bg-brand"
									)}
									aria-hidden="true"
								/>
							</button>
						)
					})}
				</div>

				<div className="flex justify-end">
					<Button
						type="button"
						className="h-11 rounded-full bg-success-500 px-6 text-sm font-medium text-white hover:bg-success-400"
						disabled={pendingLocale === locale}
						onClick={handleSave}
					>
						{t("settings.language.save")}
					</Button>
				</div>
			</div>
		</div>
	)
}
