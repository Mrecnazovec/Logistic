"use client"

import { Button } from "@/components/ui/Button"
import dynamic from "next/dynamic"
import { useState } from "react"
import { Mail, MessageCircle, PhoneCall, Send } from "lucide-react"

const RichTextEditor = dynamic(() =>
	import("@/components/ui/form-control/RichEditor/RichTextEditor").then((m) => m.RichTextEditor),
)

const contacts = [
	{ id: "phone", label: "998 91 123 45 67", icon: PhoneCall, accent: "bg-gray-100 text-slate-600" },
	{ id: "mail", label: "dispatch@gmail.com", icon: Mail, accent: "bg-gray-100 text-slate-600" },
	{ id: "whatsapp", label: "WhatsApp", icon: MessageCircle, accent: "bg-green-100 text-emerald-600" },
	{ id: "telegram", label: "Telegram", icon: Send, accent: "bg-sky-100 text-sky-600" },
]

export function SupportPage() {
	const [message, setMessage] = useState<string>("")

	return (
		<div className="rounded-[32px] bg-white p-6 shadow-sm md:p-8">
			<div className="space-y-1">
				<h1 className="text-xl font-semibold text-foreground md:text-2xl">Поддержка</h1>
				<p className="text-sm text-muted-foreground">Напишите нам, чтобы мы могли вам помочь</p>
			</div>

			<div className="mt-6 space-y-6">
				<div className="rounded-3xl bg-grayscale-50 p-4 shadow-inner">
					<RichTextEditor value={message} onChange={setMessage} placeholder="Начните писать..." />
					<div className="mt-4 flex justify-end">
						<Button
							type="button"
							className="h-11 rounded-full bg-[#8A9099] px-6 text-sm font-medium text-white hover:bg-[#7a808a]"
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
								<div
									key={contact.id}
									className="flex items-center gap-3 rounded-[18px] bg-grayscale-50 px-5 py-4 text-[15px] font-medium text-foreground shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
								>
									<span className={`flex size-9 items-center justify-center rounded-full ${contact.accent}`} aria-hidden="true">
										<Icon className="size-5" />
									</span>
									<span>{contact.label}</span>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}
