'use client'

import { Button } from "@/components/ui/Button"
import { Container } from "@/components/ui/Container"
import { useI18n } from "@/i18n/I18nProvider"
import {
	Archive,
	ArrowRight,
	BarChart3,
	ClipboardList,
	Eye,
	MessageCircle,
	MessageCircleHeart,
	Phone,
	Route,
	ShieldCheck,
} from "lucide-react"
import Link from "next/link"

import { ConsultationModal } from "@/components/ui/modals/ConsultationModal"

const FEATURE_CARDS = [
	{
		key: "planning",
		number: "01",
		Icon: ClipboardList,
	},
	{
		key: "transparency",
		number: "02",
		Icon: Eye,
	},
	{
		key: "reliability",
		number: "03",
		Icon: ShieldCheck,
	},
	{
		key: "analytics",
		number: "04",
		Icon: BarChart3,
	},
	{
		key: "preservation",
		number: "05",
		Icon: Archive,
	},
	{
		key: "traceability",
		number: "06",
		Icon: Route,
	},
] as const

const CONTACT_CARDS = [
	{
		key: "sales",
		Icon: MessageCircleHeart,
		href: "mailto:kad.noreply1@gmail.com",
		label: "kad.noreply1@gmail.com",
	},
	{
		key: "support",
		Icon: MessageCircle,
		href: "mailto:kad.noreply1@gmail.com",
		label: "kad.noreply1@gmail.com",
	},
	{
		key: "phone",
		Icon: Phone,
		href: "tel:+998701224321",
		label: "+998 70 122 43 21",
	},
] as const

export function HomePage() {
	const { t } = useI18n()

	return <div className="font-urbanist">
		<section
			className="w-full min-h-screen bg-[url(/png/Landing_bg.png)] bg-cover bg-bottom bg-no-repeat flex items-center justify-center py-32"
			id="main"
		>
			<Container className="flex items-center justify-center flex-col">
				<div className="flex flex-col items-center justify-center text-white text-center max-w-[823px] sm:mb-32 mb-10">
					<div className="w-4 h-[1px] bg-white mb-4"></div>
					<h1 className="mb-12 sm:text-[40px] text-3xl tracking-wider ">{t("home.hero.title")}</h1>
					<h2 className="sm:text-2xl text-lg tracking-wider mb-12">{t("home.hero.subtitle")}</h2>
					<Link href="/auth/register">
						<Button className="text-white underline text-xl" variant={'link'}>{t("home.hero.register")}</Button>
					</Link>
				</div>
				<ConsultationModal
					trigger={
						<button
							type="button"
							className="max-w-[427px] text-white sm:self-end self-center text-left transition-opacity hover:opacity-90 cursor-pointer"
						>
							<h2 className="font-semibold text-xl mb-5">{t("home.consultation.title")}</h2>
							<div className="flex items-center gap-10 pb-3 mb-5 border-b border-white/40">
								<h3 className="text-base">{t("home.consultation.prompt")}</h3>
								<ArrowRight className="size-4" />
							</div>
							<p className="text-sm text-white/70">{t("home.consultation.note")}</p>
						</button>
					}
				/>
			</Container>
		</section>
		<section className="min-h-screen bg-brand w-full bg-[url(/png/landing_map.png)] sm:bg-right-bottom sm:bg-[length:50%_auto] bg-contain bg-no-repeat flex items-center">
			<Container>
				<div className="max-w-[532px] space-y-6 text-white">
					<h1 className="uppercase tracking-wide text-base ">{t("home.operations.eyebrow")}</h1>
					<h2 className="font-semibold text-3xl">{t("home.operations.title")}</h2>
					<p className="text-xl font-extralight">{t("home.operations.description")}</p>
				</div>
			</Container>
		</section>
		<section className="bg-[#f6f4ef] py-24" id='info'>
			<Container>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{FEATURE_CARDS.map(({ key, number, Icon }) => (
						<div key={`${key}-${number}`} className="group perspective-[1200px]">
							<div
								className="relative h-[260px] w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]"
								tabIndex={0}
								aria-label={`${t(`home.cards.${key}.title`)}. ${t(`home.cards.${key}.description`)}`}
							>
								<div className="absolute inset-0 rounded-2xl bg-white p-6 text-[#111111] shadow-[0_20px_60px_rgba(0,0,0,0.12)] [backface-visibility:hidden]">
									<div className="flex items-start justify-between">
										<Icon className="size-12 text-[#111111]" />
										<span className="text-sm text-[#111111]/50">{number}</span>
									</div>
									<h3 className="mt-6 text-xl font-semibold">{t(`home.cards.${key}.title`)}</h3>
									<p className="mt-3 text-sm text-[#111111]/75">{t(`home.cards.${key}.description`)}</p>
								</div>
								<div className="absolute inset-0 rounded-2xl bg-white p-6 text-[#111111] shadow-[0_20px_60px_rgba(0,0,0,0.12)] [transform:rotateY(180deg)] [backface-visibility:hidden]">
									<div className="flex h-full flex-col justify-center text-center">
										<p className="text-base leading-relaxed">{t(`home.cards.${key}.backText`)}</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</Container>
		</section>
		<section className="bg-[url(/png/bg_section_landing_1.png)] bg-cover bg-no-repeat py-32" id="how">
			<Container>
				<div className="max-w-[457px] text-white">
					<h1 className="uppercase tracking-wide text-base">{t("home.how.title")}</h1>
					<p className="sm:text-[52px] text-3xl">{t("home.how.subtitle")}</p>
				</div>
			</Container>
		</section>
		<section className="bg-white py-24" id="contacts">
			<Container>
				<div className="mx-auto max-w-3xl text-center">
					<p className="text-brand text-sm font-semibold">{t("home.contacts.eyebrow")}</p>
					<h2 className="mt-3 text-3xl font-semibold text-[#0f172a]">
						{t("home.contacts.title")}
					</h2>
					<p className="mt-3 text-base text-[#64748b]">
						{t("home.contacts.subtitle")}
					</p>
				</div>
				<div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
					{CONTACT_CARDS.map(({ key, Icon, href, label }) => (
						<div key={key} className="rounded-3xl bg-neutral-50 p-6 space-y-4">
							<div className="size-12 rounded-2xl bg-brand text-white flex items-center justify-center">
								<Icon className="size-6" />
							</div>
							<div className="space-y-2">
								<p className="text-lg font-semibold">{t(`home.contacts.${key}.title`)}</p>
								<p className="text-sm text-muted-foreground">{t(`home.contacts.${key}.description`)}</p>
							</div>
							<Link className="text-sm text-brand font-semibold" href={href}>
								{label}
							</Link>
						</div>
					))}
				</div>
			</Container>
		</section>
	</div>
}
