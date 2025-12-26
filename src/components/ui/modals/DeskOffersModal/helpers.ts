import { formatDateValue, formatWeightValue } from '@/lib/formatters'
import { getTransportName, type TransportTypeEnum } from '@/shared/enums/TransportType.enum'
import type { IOfferShort } from '@/shared/types/Offer.interface'

import type { CargoInfo } from "./types"

export const buildCargoInfo = (
	offers: IOfferShort[],
	t: (key: string) => string,
	initialPrice?: string,
): CargoInfo | null => {
	const firstOffer = offers[0]
	if (!firstOffer) return null

	return {
		origin: `${firstOffer.origin_city}, ${firstOffer.origin_country}`,
		originDate: formatDateValue(firstOffer.load_date, 'dd MMM, EEE', '-'),
		destination: `${firstOffer.destination_city}, ${firstOffer.destination_country}`,
		destinationDate: formatDateValue(firstOffer.delivery_date, 'dd MMM, EEE', '-'),
		transport: getTransportName(t, firstOffer.transport_type as TransportTypeEnum) || firstOffer.transport_type,
		weight: firstOffer.weight_t ? formatWeightValue(firstOffer.weight_t) : '-',
		route_km: firstOffer.route_km,
		initialPrice,
	}
}
