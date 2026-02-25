import type { InvitePreview } from '@/shared/types/Order.interface'

export type InvitePageTranslator = (key: string, params?: Record<string, string | number>) => string

export type InvitePreviewViewModel = {
	formattedLoadDate: string
	formattedDeliveryDate: string
	transport: string
	weightText: string
	formattedPrice: string
	paymentMethodLabel: string
	inviterId: number | null
	inviterName: string
	inviterCompany: string
	distanceText: string
	originCity: string
	destinationCity: string
}

export type InviteContentState = {
	accessToken: string | null
	invitePreview: InvitePreview | undefined
	isLoadingInvitePreview: boolean
	authHref: string
}
