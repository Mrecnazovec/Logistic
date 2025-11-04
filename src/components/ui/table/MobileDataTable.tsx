import { ContactSelector } from "@/shared/enums/ContactPref.enum"
import { PriceSelector } from "@/shared/enums/PriceCurrency.enum"
import { TransportSelect } from "@/shared/enums/TransportType.enum"
import { IPaginatedCargoListList } from "@/shared/types/PaginatedList.interface"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Activity } from "react"
import { CargoActionsDropdown } from "../actions/CargoActionsDropdown"
import { OfferModal } from "../modals/OfferModal"

interface DataTableProps {
	data: IPaginatedCargoListList
	isOffer?: boolean
	isActions?: boolean
}

export function MobileDataTable({ data, isActions = false, isOffer = false }: DataTableProps) {
	const getTimeAgo = (dateStr: string) => {
		const createdAt = new Date(dateStr)
		const diffMs = Date.now() - createdAt.getTime()
		const minutes = Math.floor(diffMs / (1000 * 60))
		const hours = Math.floor(minutes / 60)
		const days = Math.floor(hours / 24)

		if (days >= 1) return `${days} дн. назад`
		if (hours >= 1) return `${hours} ч. назад`
		return `${minutes} мин. назад`
	}

	return (
		<div className="bg-background px-4 py-8 space-y-6 md:hidden">
			{data?.results.map((item, index) => {
				const contactName =
					ContactSelector.find(t => t.type === item.contact_pref)?.name ?? "—"
				const transportName =
					TransportSelect.find(t => t.type === item.transport_type)?.name ?? "—"
				const priceName =
					PriceSelector.find(t => t.type === item.price_currency)?.name ?? "—"

				return (
					<div
						key={index}
						className="space-y-2 border-b last:border-0 pb-6 last:pb-0"
					>
						<Row label="Компания" value={item.company_name} />
						<Row label={contactName} value={item.contact_value} />
						<Row label="Опубл. вр" value={getTimeAgo(item.created_at)} />
						<Row label="Цена" value={item.price_value ?? "—"} />
						<Row label="Валюта" value={priceName} />
						<Row label="Путь (км)" value={item.route_km} />
						<Row label="Вес (т)" value={item.weight_t} />
						<Row
							label="Погрузка"
							value={`${item.origin_city}, ${item.origin_country}`}
						/>
						<Row
							label="Разгрузка"
							value={`${item.destination_city}, ${item.destination_country}`}
						/>
						<Row
							label="Дата"
							value={format(item.load_date, "dd/MM/yyyy", { locale: ru })}
						/>
						<Row label="Тип транспорта" value={transportName} />
						<div className="flex justify-end">
							<Activity mode={isOffer ? 'visible' : 'hidden'}><OfferModal className="w-full" selectedRow={item} /></Activity>
							<Activity mode={isActions ? 'visible' : 'hidden'}><CargoActionsDropdown cargo={item} /></Activity>
						</div>
					</div>
				)
			})}
		</div>
	)
}

function Row({
	label,
	value,
}: {
	label: string
	value: string | number | null
}) {
	return (
		<p className="flex items-center gap-3 justify-between sm:text-base">
			<span className="text-muted-foreground">{label}:</span>
			<span className={`text-end font-semibold`}>
				{value ?? "—"}
			</span>
		</p>
	)
}
