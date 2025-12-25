"use client"

import { Button } from "@/components/ui/Button"
import { useCreateSupportTicket } from "@/hooks/queries/support/useCreateSupportTicket"
import { useState } from "react"
import { Mail, MessageCircle, PhoneCall, Send } from "lucide-react"
import { Textarea } from "@/components/ui/form-control/Textarea"
import Link from "next/link"

const contacts = [
	{
		id: "phone",
		label: "998 70 122 43 21",
		href: "tel:+998701224321",
		icon: PhoneCall,
		accent: "bg-gray-100 text-slate-600",
	},
	{
		id: "mail",
		label: "kad.noreply1@gmail.com",
		href: "mailto:kad.noreply1@gmail.com",
		icon: Mail,
		accent: "bg-gray-100 text-slate-600",
	},
	{
		id: "whatsapp",
		label: "WhatsApp",
		href: "https://wa.me/998701224321",
		icon: MessageCircle,
		accent: "bg-green-100 text-emerald-600",
		target: "_blank",
		rel: "noreferrer",
	},
	{
		id: "telegram",
		label: "@KAD_support",
		href: "https://t.me/KAD_support",
		icon: Send,
		accent: "bg-sky-100 text-sky-600",
		target: "_blank",
		rel: "noreferrer",
	},
]

export function SupportPage() {
	const [message, setMessage] = useState<string>("")
	const { createSupportTicket, isLoadingCreate } = useCreateSupportTicket()
	const canSubmit = message.trim().length > 0 && !isLoadingCreate

	const handleSubmit = () => {
		const trimmedMessage = message.trim()

		if (!trimmedMessage) return

		createSupportTicket(
			{ message: trimmedMessage },
			{
				onSuccess: () => setMessage(""),
			},
		)
	}

	return (
		<div className="rounded-[32px] bg-white p-6 shadow-sm md:p-8">
			<div className="space-y-1">
				<h1 className="text-xl font-semibold text-foreground md:text-2xl">Поддержка</h1>
				<p className="text-sm text-muted-foreground">Напишите нам, чтобы мы могли вам помочь</p>
			</div>

			<div className="mt-6 space-y-6">
				<div className="rounded-3xl bg-grayscale-50 p-4 shadow-inner">
					<Textarea
						value={message}
						onChange={(event) => setMessage(event.target.value)}
						placeholder="Начните писать..."
						disabled={isLoadingCreate}
						className="min-h-[156px] rounded-4xl border-none bg-grayscale-50 px-6 py-4"
					/>
					<div className="mt-4 flex justify-end">
						<Button
							type="button"
							onClick={handleSubmit}
							disabled={!canSubmit}
							className="h-11 rounded-full disabled:bg-[#8A9099] px-6 text-sm font-medium text-white bg-success-500 hover:bg-success-400"
						>
							Отправить
						</Button>
					</div>
				</div>

				<div className="space-y-3">
					<p className="text-sm text-muted-foreground">Либо свяжитесь через</p>
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{contacts.map((contact) => {
							const Icon = contact.icon
							return (
								<Link
									key={contact.id}
									href={contact.href}
									target={contact.target}
									rel={contact.rel}
									className="hover:underline underline-offset-4"
								>
									<div
										className="flex items-center gap-3 rounded-[18px] bg-grayscale-50 px-5 py-4 text-[15px] font-medium text-foreground shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
									>
										<span className={`flex size-9 items-center justify-center rounded-full ${contact.accent}`} aria-hidden="true">
											<Icon className="size-5" />
										</span>

										{contact.label}
									</div>
								</Link>

							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}
