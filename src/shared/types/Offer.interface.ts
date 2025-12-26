import type { components } from './api'

export type IOfferAcceptResponse = components['schemas']['OfferAcceptResponse']
export type IOfferCounter = components['schemas']['OfferCounterRequest']
export type OfferCreateDto = components['schemas']['OfferCreateRequest']
export type IOfferDetail = components['schemas']['OfferDetail']
export type IOfferInvite = components['schemas']['OfferInviteRequest']
export type GenerateInviteResponse = components['schemas']['GenerateInviteResponse']
export type IOfferRejectResponse = components['schemas']['OfferRejectResponse']
export type IOfferStatusLog = components['schemas']['OfferStatusLog']
export type IOfferShort = components['schemas']['OfferShort'] & {
	invite_token?: string | null
	invite_offer?: string | null
}
