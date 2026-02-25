import { DASHBOARD_URL, PUBLIC_URL } from '@/config/url.config'
import type { PriceCurrencyCode } from '@/lib/currency'
import { DEFAULT_PLACEHOLDER, formatDateValue, formatDistanceKm, formatPriceValue } from '@/lib/formatters'
import { getTransportName, type TransportTypeEnum } from '@/shared/enums/TransportType.enum'
import type { InvitePreview } from '@/shared/types/Order.interface'
import type { InvitePageTranslator, InvitePreviewViewModel } from '../types/invitePage.types'

export const buildAuthHref = (token: string, pathname: string, query: string) => {
	const basePath = token ? DASHBOARD_URL.order(`invite/${token}`) : pathname
	const returnPath = query ? `${basePath}?${query}` : basePath
	return `${PUBLIC_URL.auth()}?next=${encodeURIComponent(returnPath)}`
}

export const buildInvitePreviewViewModel = (
	invitePreview: InvitePreview,
	t: InvitePageTranslator,
): InvitePreviewViewModel => {
	const formattedLoadDate = formatDateValue(invitePreview.load_date, 'dd.MM.yyyy', DEFAULT_PLACEHOLDER)
	const formattedDeliveryDate = formatDateValue(invitePreview.delivery_date, 'dd.MM.yyyy', DEFAULT_PLACEHOLDER)
	const transport = invitePreview.transport_type
		? getTransportName(t, invitePreview.transport_type as TransportTypeEnum) || invitePreview.transport_type
		: DEFAULT_PLACEHOLDER
	const weightText = invitePreview.weight_kg
		? `${(invitePreview.weight_kg / 1000).toLocaleString('ru-RU')} ${t('order.invite.ton')}`
		: DEFAULT_PLACEHOLDER
	const formattedPrice = formatPriceValue(
		invitePreview.driver_price,
		(invitePreview.driver_currency as PriceCurrencyCode | null | undefined) ?? undefined,
	)
	const paymentMethodLabel = invitePreview.driver_payment_method
		? t(`shared.payment.${invitePreview.driver_payment_method === 'bank_transfer' ? 'bankTransfer' : invitePreview.driver_payment_method}`)
		: DEFAULT_PLACEHOLDER
	const inviter = invitePreview.inviter as { id?: number; name?: string; company?: string } | null

	return {
		formattedLoadDate,
		formattedDeliveryDate,
		transport,
		weightText,
		formattedPrice,
		paymentMethodLabel,
		inviterId: inviter?.id ?? null,
		inviterName: inviter?.name ?? DEFAULT_PLACEHOLDER,
		inviterCompany: inviter?.company ?? DEFAULT_PLACEHOLDER,
		distanceText: formatDistanceKm(invitePreview.route_distance_km, DEFAULT_PLACEHOLDER),
		originCity: invitePreview.origin_city ?? DEFAULT_PLACEHOLDER,
		destinationCity: invitePreview.destination_city ?? DEFAULT_PLACEHOLDER,
	}
}
