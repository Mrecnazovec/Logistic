'use client'

import { MessageCircle, MessageCircleHeart, Phone, UserCircle2 } from "lucide-react"

import { DASHBOARD_URL } from "@/config/url.config"
import { useGetDashboardStats } from "@/hooks/queries/auth/useGetDashboardStats"
import { useI18n } from '@/i18n/I18nProvider'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { useRoleStore } from '@/store/useRoleStore'
import Link from "next/link"
import { useMemo } from "react"

export function Dashboard() {
	const { t } = useI18n()
	const { dashboardStats } = useGetDashboardStats()
	const role = useRoleStore((state) => state.role)
	const roleSections = useMemo(
		() =>
			({
				[RoleEnum.CUSTOMER]: {
					eyebrow: t('dashboard.roles.eyebrow'),
					title: t('dashboard.roles.customer.title'),
					cards: [
						{ title: t('dashboard.roles.customer.cards.publications.title'), description: t('dashboard.roles.customer.cards.publications.description'), link: DASHBOARD_URL.posting() },
						{ title: t('dashboard.roles.customer.cards.search.title'), description: t('dashboard.roles.customer.cards.search.description'), link: DASHBOARD_URL.announcements() },
						{ title: t('dashboard.roles.customer.cards.open.title'), description: t('dashboard.roles.customer.cards.open.description'), link: DASHBOARD_URL.desk() },
						{ title: t('dashboard.roles.customer.cards.active.title'), description: t('dashboard.roles.customer.cards.active.description'), link: DASHBOARD_URL.transportation() },
						{ title: t('dashboard.roles.customer.cards.check.title'), description: t('dashboard.roles.customer.cards.check.description'), link: DASHBOARD_URL.rating() },
						{ title: t('dashboard.roles.customer.cards.history.title'), description: t('dashboard.roles.customer.cards.history.description'), link: DASHBOARD_URL.history() },
					],
				},
				[RoleEnum.LOGISTIC]: {
					eyebrow: t('dashboard.roles.eyebrow'),
					title: t('dashboard.roles.logistic.title'),
					cards: [
						{ title: t('dashboard.roles.logistic.cards.publications.title'), description: t('dashboard.roles.logistic.cards.publications.description'), link: DASHBOARD_URL.posting() },
						{ title: t('dashboard.roles.logistic.cards.search.title'), description: t('dashboard.roles.logistic.cards.search.description'), link: DASHBOARD_URL.announcements() },
						{ title: t('dashboard.roles.logistic.cards.trade.title'), description: t('dashboard.roles.logistic.cards.trade.description'), link: DASHBOARD_URL.desk() },
						{ title: t('dashboard.roles.logistic.cards.active.title'), description: t('dashboard.roles.logistic.cards.active.description'), link: DASHBOARD_URL.transportation() },
						{ title: t('dashboard.roles.logistic.cards.check.title'), description: t('dashboard.roles.logistic.cards.check.description'), link: DASHBOARD_URL.rating() },
						{ title: t('dashboard.roles.logistic.cards.history.title'), description: t('dashboard.roles.logistic.cards.history.description'), link: DASHBOARD_URL.history() },
					],
				},
				[RoleEnum.CARRIER]: {
					eyebrow: t('dashboard.roles.eyebrow'),
					title: t('dashboard.roles.carrier.title'),
					cards: [
						{ title: t('dashboard.roles.carrier.cards.search.title'), description: t('dashboard.roles.carrier.cards.search.description'), link: DASHBOARD_URL.announcements() },
						{ title: t('dashboard.roles.carrier.cards.myOffers.title'), description: t('dashboard.roles.carrier.cards.myOffers.description'), link: DASHBOARD_URL.desk() },
						{ title: t('dashboard.roles.carrier.cards.personal.title'), description: t('dashboard.roles.carrier.cards.personal.description'), link: DASHBOARD_URL.desk() },
						{ title: t('dashboard.roles.carrier.cards.active.title'), description: t('dashboard.roles.carrier.cards.active.description'), link: DASHBOARD_URL.transportation() },
						{ title: t('dashboard.roles.carrier.cards.check.title'), description: t('dashboard.roles.carrier.cards.check.description'), link: DASHBOARD_URL.rating() },
						{ title: t('dashboard.roles.carrier.cards.history.title'), description: t('dashboard.roles.carrier.cards.history.description'), link: DASHBOARD_URL.history() },
					],
				},
			}) as const,
		[t],
	)
	const roleSection = role ? roleSections[role] : undefined
	const contactCards = useMemo(
		() => [
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
		],
		[],
	)

	return (
		<div className="h-full bg-background rounded-4xl sm:py-12 py-4 space-y-14">
			<section className="bg-[url('/png/dashboard-truck-hero-bg.png')] lg:bg-[length:749px_auto] sm:bg-[length:500px_auto] bg-contain bg-no-repeat bg-bottom-right lg:min-h-[500px] min-h-[400px] flex flex-col gap-7 justify-between items-center">
				<div className="flex flex-col items-center justify-center">
					<p className="text-center text-brand text-base xs:mb-3 mb-1 font-semibold">{t('dashboard.hero.eyebrow')}</p>
					<h1 className="text-center font-semibold max-w-[900px] sm:text-5xl xs:text-3xl text-xl p-4">{t('dashboard.hero.title')}</h1>
				</div>
				<div className="lg:px-12 sm:px-6 px-4 flex md:flex-row flex-col justify-between gap-7 w-full">
					<div className="rounded-3xl border-[1px] border-[#E5E7EB] lg:py-6 lg:px-8 py-3 px-4 bg-background flex-1">
						<div className="xs:space-y-3 max-xs:flex max-xs:items-center max-xs:gap-3 max-xs:justify-between">
							<div className="flex justify-between gap-3">
								<p className="text-[#6B7280] text-sm">{t('dashboard.stats.card1.label')}</p>
								<div className="size-12 flex items-center justify-center bg-brand/20 rounded-full shrink-0 max-xs:hidden">
									<UserCircle2 className="size-6 text-brand-500" />
								</div>
							</div>
							<div className="max-xs:flex max-xs:items-center max-xs:gap-2">
								<p className="text-xl font-bold">{dashboardStats?.total_users ?? 0}</p>
								<div className="flex items-center gap-3">
									<p className="text-[#6B7280] text-xs max-xs:hidden">{t('dashboard.stats.caption')}</p>
									<span className="bg-success-500/10 text-success-500 rounded-[12px] py-0.5 px-1">+13%</span>
								</div>
							</div>
						</div>

					</div>
					<div className="rounded-3xl border-[1px] border-[#E5E7EB] lg:py-6 lg:px-8 py-3 px-4 bg-background flex-1">
						<div className="xs:space-y-3 max-xs:flex max-xs:items-center max-xs:gap-3 max-xs:justify-between">
							<div className="flex justify-between gap-3">
								<div className="text-[#6B7280] text-sm"><p>{t('dashboard.stats.card2.label')}</p></div>
								<div className="size-12 flex items-center justify-center bg-brand/20 rounded-full shrink-0 max-xs:hidden">
									<UserCircle2 className="size-6 text-brand-500" />
								</div>
							</div>
							<div className="max-xs:flex max-xs:items-center max-xs:gap-2">
								<div className="flex items-center gap-2"><span className="size-2 rounded-full bg-success-500"></span> <p className="text-xl font-bold">{dashboardStats?.online_users ?? 0}</p></div>
								<div className="flex items-center gap-3">
									<p className="text-[#6B7280] text-xs max-xs:hidden">{t('dashboard.stats.caption')}</p>
									<span className="bg-success-500/10 text-success-500 rounded-[12px] py-0.5 px-1">+13%</span>
								</div>
							</div>
						</div>
					</div>

					<div className="rounded-3xl border-[1px] border-[#E5E7EB] lg:py-6 lg:px-8 py-3 px-4 bg-background flex-1">
						<div className="xs:space-y-3 max-xs:flex max-xs:items-center max-xs:gap-3 max-xs:justify-between">
							<div className="flex justify-between gap-3">
								<div className="text-[#6B7280] text-sm"><p>{t('dashboard.stats.card3.label')}</p></div>
								<div className="size-12 flex items-center justify-center bg-brand/20 rounded-full shrink-0 max-xs:hidden">
									<UserCircle2 className="size-6 text-brand-500" />
								</div>
							</div>
							<div className="max-xs:flex max-xs:items-center max-xs:gap-2">
								<div className="flex items-center gap-2"><span className="size-2 rounded-full bg-neutral-400"></span> <p className="text-xl font-bold">{dashboardStats?.total_cargos ?? 0}</p></div>
								<div className="flex items-center gap-3">
									<p className="text-[#6B7280] text-xs max-xs:hidden">{t('dashboard.stats.caption')}</p>
									<span className="bg-success-500/10 text-success-500 rounded-[12px] py-0.5 px-1">+13%</span>
								</div>
							</div>
						</div>

					</div>

				</div>

			</section>
			{/* <section className="lg:px-12 sm:px-6 px-4">
				<div className="aspect-[1123/401] rounded-3xl bg-accent flex items-center justify-center px-2">
					<p className="text-center max-xs:text-xs">{t('dashboard.cta.text')}</p>
				</div>
			</section> */}
			<section className="lg:px-12 sm:px-6 px-4">
				{roleSection ? (
					<div className="space-y-6">
						<p className="text-center text-brand text-base xs:mb-3 mb-1 font-semibold">{roleSection.eyebrow}</p>
						<h2 className="text-center text-3xl font-semibold">{roleSection.title}</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
							{roleSection.cards.map((card) => (
								<Link href={card.link} key={card.title} className="rounded-2xl bg-[#1F2937] text-white p-6 min-h-[180px]">
									<p className="text-lg font-semibold pb-3 border-b border-white/20">{card.title}</p>
									<p className="text-sm text-white/80 pt-3">{card.description}</p>
								</Link>
							))}
						</div>
					</div>
				) : null}
			</section>
			<section className="lg:px-12 sm:px-6 px-4">
				<div className="text-center space-y-4">
					<p className="text-center text-brand text-base xs:mb-3 mb-1 font-semibold">{t('dashboard.contact.eyebrow')}</p>
					<h2 className="text-3xl sm:text-4xl font-semibold">{t('dashboard.contact.title')}</h2>
					<p className="text-muted-foreground">{t('dashboard.contact.subtitle')}</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
					{contactCards.map(({ key, Icon, href, label }) => (
						<div key={key} className="rounded-3xl bg-neutral-50 p-6 space-y-4">
							<div className="size-12 rounded-2xl bg-brand text-white flex items-center justify-center">
								<Icon className="size-6" />
							</div>
							<div className="space-y-2">
								<p className="text-lg font-semibold">{t(`dashboard.contact.${key}.title`)}</p>
								<p className="text-sm text-muted-foreground">{t(`dashboard.contact.${key}.description`)}</p>
							</div>
							<Link className="text-sm text-brand font-semibold" href={href}>{label}</Link>
						</div>
					))}
				</div>
			</section>
		</div>
	)
}
