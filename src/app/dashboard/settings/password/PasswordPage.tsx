"use client"

import { Button } from "@/components/ui/Button"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/form-control/InputGroup"
import { Label } from "@/components/ui/form-control/Label"
import { useI18n } from "@/i18n/I18nProvider"
import { Eye, EyeOff, Lock } from "lucide-react"
import { useState } from "react"

export function PasswordPage() {
	const { t } = useI18n()
	const [isOldVisible, setIsOldVisible] = useState(false)
	const [isNewVisible, setIsNewVisible] = useState(false)

	return (
		<div className="rounded-[32px] bg-white p-6 shadow-sm md:p-8">
			<div className="space-y-1">
				<h1 className="text-xl font-semibold text-foreground md:text-2xl">{t("settings.password.title")}</h1>
				<p className="text-sm text-muted-foreground">{t("settings.password.subtitle")}</p>
			</div>

			<div className="mt-8 space-y-7">
				<section className="space-y-3">
					<div>
						<Label className="text-base font-semibold text-foreground">{t("settings.password.old.label")}</Label>
						<p className="text-sm text-muted-foreground">{t("settings.password.old.hint")}</p>
					</div>
					<InputGroup className="h-[52px] rounded-full bg-grayscale-50">
						<InputGroupAddon className="pl-4 text-muted-foreground">
							<Lock className="size-5" />
						</InputGroupAddon>
						<InputGroupInput
							type={isOldVisible ? "text" : "password"}
							placeholder={t("settings.password.old.placeholder")}
							className="text-[15px] placeholder:text-muted-foreground/80"
						/>
						<InputGroupAddon align="inline-end" className="pr-3">
							<InputGroupButton
								type="button"
								variant="ghost"
								size="icon-sm"
								className="text-muted-foreground hover:text-foreground"
								onClick={() => setIsOldVisible((prev) => !prev)}
								aria-label={isOldVisible ? t("settings.password.hide") : t("settings.password.show")}
							>
								{isOldVisible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
							</InputGroupButton>
						</InputGroupAddon>
					</InputGroup>
				</section>

				<section className="space-y-3">
					<div>
						<Label className="text-base font-semibold text-foreground">{t("settings.password.new.label")}</Label>
						<p className="text-sm text-muted-foreground">{t("settings.password.new.hint")}</p>
					</div>
					<InputGroup className="h-[52px] rounded-full bg-grayscale-50">
						<InputGroupAddon className="pl-4 text-muted-foreground">
							<Lock className="size-5" />
						</InputGroupAddon>
						<InputGroupInput
							type={isNewVisible ? "text" : "password"}
							placeholder={t("settings.password.new.placeholder")}
							className="text-[15px] placeholder:text-muted-foreground/80"
						/>
						<InputGroupAddon align="inline-end" className="pr-3">
							<InputGroupButton
								type="button"
								variant="ghost"
								size="icon-sm"
								className="text-muted-foreground hover:text-foreground"
								onClick={() => setIsNewVisible((prev) => !prev)}
								aria-label={isNewVisible ? t("settings.password.hide") : t("settings.password.show")}
							>
								{isNewVisible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
							</InputGroupButton>
						</InputGroupAddon>
					</InputGroup>
				</section>

				<div className="flex flex-wrap justify-end gap-3 pt-2">
					<Button
						type="button"
						variant="outline"
						className="h-11 rounded-full border-[#D1D5DB] bg-white px-5 text-sm font-medium text-muted-foreground hover:bg-muted/40"
					>
						{t("settings.password.reset")}
					</Button>
					<Button
						type="button"
						className="h-11 rounded-full bg-success-500 px-6 text-sm font-medium text-white hover:bg-success-400"
					>
						{t("settings.password.save")}
					</Button>
				</div>
			</div>
		</div>
	)
}
