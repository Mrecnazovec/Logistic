"use client"

import { Button } from "@/components/ui/Button"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/form-control/InputGroup"
import { Label } from "@/components/ui/form-control/Label"
import { Eye, EyeOff, Lock } from "lucide-react"
import { useState } from "react"

export function PasswordPage() {
	const [isOldVisible, setIsOldVisible] = useState(false)
	const [isNewVisible, setIsNewVisible] = useState(false)

	return (
		<div className="rounded-[32px] bg-white p-6 shadow-sm md:p-8">
			<div className="space-y-1">
				<h1 className="text-xl font-semibold text-foreground md:text-2xl">Пароль</h1>
				<p className="text-sm text-muted-foreground">Измените свой пароль</p>
			</div>

			<div className="mt-8 space-y-7">
				<section className="space-y-3">
					<div>
						<Label className="text-base font-semibold text-foreground">Старый пароль</Label>
						<p className="text-sm text-muted-foreground">Введите пароль</p>
					</div>
					<InputGroup className="h-[52px] rounded-full bg-grayscale-50">
						<InputGroupAddon className="pl-4 text-muted-foreground">
							<Lock className="size-5" />
						</InputGroupAddon>
						<InputGroupInput
							type={isOldVisible ? "text" : "password"}
							placeholder="Введите пароль"
							className="text-[15px] placeholder:text-muted-foreground/80"
						/>
						<InputGroupAddon align="inline-end" className="pr-3">
							<InputGroupButton
								type="button"
								variant="ghost"
								size="icon-sm"
								className="text-muted-foreground hover:text-foreground"
								onClick={() => setIsOldVisible((prev) => !prev)}
								aria-label={isOldVisible ? "Скрыть пароль" : "Показать пароль"}
							>
								{isOldVisible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
							</InputGroupButton>
						</InputGroupAddon>
					</InputGroup>
				</section>

				<section className="space-y-3">
					<div>
						<Label className="text-base font-semibold text-foreground">Новый пароль</Label>
						<p className="text-sm text-muted-foreground">Введите пароль</p>
					</div>
					<InputGroup className="h-[52px] rounded-full bg-grayscale-50">
						<InputGroupAddon className="pl-4 text-muted-foreground">
							<Lock className="size-5" />
						</InputGroupAddon>
						<InputGroupInput
							type={isNewVisible ? "text" : "password"}
							placeholder="Введите пароль"
							className="text-[15px] placeholder:text-muted-foreground/80"
						/>
						<InputGroupAddon align="inline-end" className="pr-3">
							<InputGroupButton
								type="button"
								variant="ghost"
								size="icon-sm"
								className="text-muted-foreground hover:text-foreground"
								onClick={() => setIsNewVisible((prev) => !prev)}
								aria-label={isNewVisible ? "Скрыть пароль" : "Показать пароль"}
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
						Сбросить пароль
					</Button>
					<Button
						type="button"
						className="h-11 rounded-full bg-[#8A9099] px-6 text-sm font-medium text-white hover:bg-[#7a808a]"
					>
						Сохранить изменения
					</Button>
				</div>
			</div>
		</div>
	)
}
