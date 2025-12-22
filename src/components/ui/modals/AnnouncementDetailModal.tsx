"use client"

import DOMPurify from "dompurify"
import { Star } from "lucide-react"
import type { ReactNode } from "react"

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

const EMPTY_VALUE = "—"
const paymentMethodLabels: Record<string, string> = {
    transfer: "Безналичный расчет",
    cash: "Наличные",
    both: "Наличные / Безналичный расчет",
}

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
    const paymentMethodRaw = (cargo as ICargoList & { payment_method?: string }).payment_method
    const transportName = getTransportName(cargo.transport_type) || cargo.transport_type || EMPTY_VALUE
    const phoneVisible = cargo.contact_pref === "phone" || cargo.contact_pref === "both"
    const emailVisible = cargo.contact_pref === "email" || cargo.contact_pref === "both"
    const phone = phoneVisible ? cargo.phone || EMPTY_VALUE : EMPTY_VALUE
    const email = emailVisible ? cargo.email || EMPTY_VALUE : EMPTY_VALUE
    const ratingDisplay = Number.isFinite(cargo.company_rating) && cargo.company_rating > 0 ? cargo.company_rating.toFixed(1) : EMPTY_VALUE
    const paymentMethod = paymentMethodLabels[paymentMethodRaw ?? ""] || paymentMethodRaw || EMPTY_VALUE
    const formattedPrice = formatPriceValue(cargo.price_value, cargo.price_currency)
    const sanitizedDescription = cargo.description ? DOMPurify.sanitize(cargo.description) : ""

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline' className='min-w-[140px] flex-1 max-sm:w-full'>
                    Подробнее
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader className='border-b pb-5'>
                    <div className='flex flex-col items-center justify-center gap-3 md:flex-row'>
                        <div className='left-6 md:absolute'>
                            <UuidCopy uuid={cargo.uuid} id={cargo.id} isPlaceholder />
                        </div>
                        <DialogTitle className='text-center text-2xl'>Детали объявления</DialogTitle>
                    </div>
                </DialogHeader>

                <div className='grid gap-10 pt-2 text-sm leading-6 md:grid-cols-2'>
                    <div className='space-y-8'>
                        <DetailSection title='Компания и представитель'>
                            <DetailRow label='Компания' value={cargo.company_name || EMPTY_VALUE} />
                            <DetailRow label='Контактное лицо' value={<ProfileLink name={cargo.user_name} id={Number(cargo.user_id)} />} />
                            <DetailRow
                                label='Рейтинг'
                                value={
                                    <span className='inline-flex items-center gap-2 text-foreground'>
                                        <Star className='size-4 fill-yellow-500 text-yellow-500' aria-hidden />
                                        <span>{ratingDisplay}</span>
                                    </span>
                                }
                            />
                            <DetailRow label='Телефон' value={phone} />
                            <DetailRow label='Email' value={email} />
                        </DetailSection>

                        <DetailSection title='Транспорт и габариты'>
                            <DetailRow label='Наименование груза' value={cargo.product || EMPTY_VALUE} />
                            <DetailRow label='Тип транспорта' value={transportName} />
                            <DetailRow label='Оси' value={cargo.axles ?? EMPTY_VALUE} />
                            <DetailRow label='Объем (м3)' value={cargo.volume_m3 ?? EMPTY_VALUE} />
                        </DetailSection>
                    </div>

                    <div className='space-y-8'>
                        <DetailSection title='Откуда'>
                            <DetailRow label='Город / страна' value={formatPlace(cargo.origin_city, cargo.origin_country, EMPTY_VALUE)} />
                            <DetailRow label='Дата погрузки' value={formatDateValue(cargo.load_date, "dd.MM.yyyy", EMPTY_VALUE)} />
                        </DetailSection>

                        <DetailSection title='Куда'>
                            <DetailRow label='Город / страна' value={formatPlace(cargo.destination_city, cargo.destination_country, EMPTY_VALUE)} />
                            <DetailRow label='Дата разгрузки' value={formatDateValue(cargo.delivery_date, "dd.MM.yyyy", EMPTY_VALUE)} />
                            <DetailRow label='Дистанция' value={`${cargo.route_km} км`} />
                        </DetailSection>

                        <DetailSection title='Оплата'>
                            <DetailRow label='Способ оплаты' value={paymentMethod} />
                            <DetailRow label='Email' value={cargo.email || EMPTY_VALUE} />
                            <DetailRow label='Телефон' value={cargo.phone || EMPTY_VALUE} />
                            <DetailRow label='Цена' value={formattedPrice} />
                        </DetailSection>
                    </div>
                </div>

                <DetailSection title='Описание'>
                    {sanitizedDescription ? (
                        <div
                            className='prose prose-sm max-w-none whitespace-pre-wrap break-words text-foreground prose-headings:mb-2 prose-p:mb-2'
                            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                        />
                    ) : (
                        <p className='text-sm text-foreground'>Описание отсутствует</p>
                    )}
                </DetailSection>
                <OfferModal className='w-fit ml-auto  max-sm:w-full' title='Предложить' selectedRow={cargo} />
            </DialogContent>
        </Dialog>
    )
}
