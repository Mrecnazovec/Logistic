import type { components, paths } from './api'

export type AgreementStatus = 'pending' | 'accepted' | 'expired' | 'cancelled'
export type AgreementParticipantRole = 'CUSTOMER' | 'LOGISTIC' | 'CARRIER'

export type AgreementParticipant = {
	role: AgreementParticipantRole
	id: number
	full_name: string
}

export type IAgreement = {
	id: number
	offer_id: number | null
	cargo_id: number | null
	status: AgreementStatus
	expires_at: string
	created_at: string
	accepted_by_customer: boolean
	accepted_by_carrier: boolean
	accepted_by_logistic: boolean
	loading_city: string
	loading_address: string
	loading_date: string
	unloading_city: string
	unloading_address: string
	unloading_date: string
	participants: AgreementParticipant[]
}

export type IPaginatedAgreementList = {
	count: number
	next: string | null
	previous: string | null
	results: IAgreement[]
}

export type IAgreementDetail = components['schemas']['AgreementDetail']

export type AgreementsListQuery = paths['/api/agreements/agreements/']['get'] extends {
  parameters: { query?: infer Q }
}
  ? Q
  : Record<string, never>
