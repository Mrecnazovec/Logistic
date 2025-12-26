"use client"

import DOMPurify from "dompurify"
import { Star } from "lucide-react"
import type { ReactNode } from "react"

import { useI18n } from "@/i18n/I18nProvider"
import { formatDateValue, formatPlace, formatPriceValue } from "@/lib/formatters"
import { getTransportName } from "@/shared/enums/TransportType.enum"
import type { ICargoList } from "@/shared/types/CargoList.interface"
import { ProfileLink } from "../actions/ProfileLink"
import { UuidCopy } from "../actions/UuidCopy"
import { Button } from "../Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../Dialog"
import { OfferModal } from "./OfferModal"

type Props = { cargo: ICargoList }

type DetailRowProps = { label: string; value: ReactNode }

const EMPTY_VALUE = "-"

const DetailRow = ({ label, value }: DetailRowProps) => (
	<div className='flex items-start justify-between gap-3 text-sm leading-relaxed'>
		<span className='text-muted-foreground'>{label}:</span>
		<span className='text-right font-semibold text-foreground'>{value}</span>
	</div>
)

const DetailSection = ({ title, children }: { title: string; children: ReactNode }) => (
	<div className='space-y-3'>
		<p className='text-base font-semibold text-brand'>{title}</p>
		<div className='space-y-2'>{children}</div>
	</div>
)

export function AnnouncementDetailModal({ cargo }: Props) {
	const { t } = useI18n()
	const paymentMethodRaw = (cargo as ICargoList & { payment_method?: string }).payment_method
	const transportName = getTransportName(t, cargo.transport_type) || cargo.transport_type || EMPTY_VALUE
	const phoneVisible = cargo.contact_pref === "phone" || cargo.contact_pref === "both"
	const emailVisible = cargo.contact_pref === "email" || cargo.contact_pref === "both"
	const phone = phoneVisible ? cargo.phone || EMPTY_VALUE : EMPTY_VALUE
	const email = emailVisible ? cargo.email || EMPTY_VALUE : EMPTY_VALUE
	const ratingDisplay = Number.isFinite(cargo.company_rating) && cargo.company_rating > 0 ? cargo.company_rating.toFixed(1) : EMPTY_VALUE
	const paymentMethod = paymentMethodRaw
		? t(`components.announcement.payment.${paymentMethodRaw}`)
		: EMPTY_VALUE
	const formattedPrice = formatPriceValue(cargo.price_value, cargo.price_currency)
	const sanitizedDescription = cargo.description ? DOMPurify.sanitize(cargo.description) : ""

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline' className='min-w-[140px] flex-1 max-sm:w-full'>
					{t("components.announcement.more")}
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader className='border-b pb-5'>
					<div className='flex flex-col items-center justify-center gap-3 md:flex-row'>
						<div className='left-6 md:absolute'>
							<UuidCopy uuid={cargo.uuid} id={cargo.id} isPlaceholder />
						</div>
						<DialogTitle className='text-center text-2xl'>{t("components.announcement.title")}</DialogTitle>
					</div>
				</DialogHeader>

				<div className='grid gap-10 pt-2 text-sm leading-6 md:grid-cols-2'>
					<div className='space-y-8'>
						<DetailSection title={t("components.announcement.section.company")}>
							<DetailRow label={t("components.announcement.label.company")} value={cargo.company_name || EMPTY_VALUE} />
							<DetailRow label={t("components.announcement.label.contact")} value={<ProfileLink name={cargo.user_name} id={Number(cargo.user_id)} />} />
							<DetailRow
								label={t("components.announcement.label.rating")}
								value={
									<span className='inline-flex items-center gap-2 text-foreground'>
										<Star className='size-4 fill-yellow-500 text-yellow-500' aria-hidden />
										<span>{ratingDisplay}</span>
									</span>
								}
							/>
							<DetailRow label={t("components.announcement.label.phone")} value={phone} />
							<DetailRow label={t("components.announcement.label.email")} value={email} />
						</DetailSection>

						<DetailSection title={t("components.announcement.section.transport")}>
							<DetailRow label={t("components.announcement.label.cargoName")} value={cargo.product || EMPTY_VALUE} />
							<DetailRow label={t("components.announcement.label.transport")} value={transportName} />
							<DetailRow label={t("components.announcement.label.axles")} value={cargo.axles ?? EMPTY_VALUE} />
							<DetailRow label={t("components.announcement.label.volume")} value={cargo.volume_m3 ?? EMPTY_VALUE} />
						</DetailSection>
					</div>

					<div className='space-y-8'>
						<DetailSection title={t("components.announcement.section.from")}>
							<DetailRow label={t("components.announcement.label.cityCountry")} value={formatPlace(cargo.origin_city, cargo.origin_country, EMPTY_VALUE)} />
							<DetailRow label={t("components.announcement.label.loadDate")} value={formatDateValue(cargo.load_date, "dd.MM.yyyy", EMPTY_VALUE)} />
						</DetailSection>

						<DetailSection title={t("components.announcement.section.to")}>
							<DetailRow label={t("components.announcement.label.cityCountry")} value={formatPlace(cargo.destination_city, cargo.destination_country, EMPTY_VALUE)} />
							<DetailRow label={t("components.announcement.label.deliveryDate")} value={formatDateValue(cargo.delivery_date, "dd.MM.yyyy", EMPTY_VALUE)} />
							<DetailRow label={t("components.announcement.label.distance")} value={`${cargo.route_km} ${t("components.announcement.km")}`} />
						</DetailSection>

						<DetailSection title={t("components.announcement.section.payment")}>
							<DetailRow label={t("components.announcement.label.paymentMethod")} value={paymentMethod} />
							<DetailRow label={t("components.announcement.label.email")} value={cargo.email || EMPTY_VALUE} />
							<DetailRow label={t("components.announcement.label.phone")} value={cargo.phone || EMPTY_VALUE} />
							<DetailRow label={t("components.announcement.label.price")} value={formattedPrice} />
						</DetailSection>
					</div>
				</div>

				<DetailSection title={t("components.announcement.section.description")}>
					{sanitizedDescription ? (
						<div
							className='prose prose-sm max-w-none whitespace-pre-wrap break-words text-foreground prose-headings:mb-2 prose-p:mb-2'
							dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
						/>
					) : (
						<p className='text-sm text-foreground'>{t("components.announcement.descriptionEmpty")}</p>
					)}
				</DetailSection>
				<OfferModal className='w-fit ml-auto  max-sm:w-full' title={t("components.announcement.makeOffer")} selectedRow={cargo} />
			</DialogContent>
		</Dialog>
	)
}
