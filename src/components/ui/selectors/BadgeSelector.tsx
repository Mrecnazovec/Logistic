'use client'

import { useI18n } from '@/i18n/I18nProvider'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { StatusEnum } from '@/shared/enums/Status.enum'
import type { IOfferShort } from '@/shared/types/Offer.interface'
import { Badge, badgeVariants } from '../Badge'

interface BadgeProps {
	status: StatusEnum
}

export type OfferStatusMeta = {
	variant: NonNullable<Parameters<typeof badgeVariants>[0]>['variant']
	label: string
	note?: string
	requireDecision?: boolean
	highlight?: boolean
}

type Translator = (key: string, params?: Record<string, string | number>) => string

const isCancelledStatus = (status: string | undefined, t: Translator) => {
	const normalized = (status || '').toLowerCase()
	return normalized.includes(t('components.badge.token.cancelled')) || normalized.includes('declin') || normalized.includes('cancel')
}

const getCounterpartyLabel = (t: Translator) => t('components.badge.counterparty')

export const getOfferStatusMeta = (offer: IOfferShort | undefined, role: RoleEnum | undefined, t: Translator): OfferStatusMeta => {
	if (!offer) return { variant: 'secondary', label: '-' }

	const isCancelled = isCancelledStatus(offer.status_display, t)
	if (offer.invite_token) {
		return {
			variant: 'violet',
			label: t('components.badge.offer.invite.label'),
			note: t('components.badge.offer.invite.note'),
			requireDecision: true,
			highlight: true,
		}
	}
	if (offer.message === t('components.badge.token.inviteMessage')) {
		return {
			variant: 'outline',
			label: t('components.badge.offer.expired.label'),
			note: t('components.badge.offer.expired.note'),
		}
	}
	const counterpartyAccepted = offer.accepted_by_customer
	const selfAccepted = role === RoleEnum.CARRIER ? offer.accepted_by_carrier : offer.accepted_by_logistic

	if (counterpartyAccepted && selfAccepted) {
		return {
			variant: 'success',
			label: t('components.badge.offer.agreed.label'),
			note: t('components.badge.offer.agreed.note'),
		}
	}

	if (isCancelled) {
		return {
			variant: 'danger',
			label: t('components.badge.offer.declined.label'),
			note: t('components.badge.offer.declined.note'),
		}
	}

	if ((counterpartyAccepted && !selfAccepted) || (offer.response_status === 'counter_from_customer' && !selfAccepted) || (offer.response_status === 'action_required' && offer.source_status === 'Предложение от заказчика')) {
		return {
			variant: 'violet',
			label: t('components.badge.offer.awaiting.label'),
			note: t('components.badge.offer.awaiting.note'),
			requireDecision: true,
			highlight: true,
		}
	}

	return {
		variant: 'warning',
		label: t('components.badge.offer.waiting.label'),
		note: t('components.badge.offer.waiting.note', {
			counterparty: getCounterpartyLabel(t),
		}),
	}
}

export function BadgeSelector({ status }: BadgeProps) {
	const { t } = useI18n()

	switch (status) {
		case StatusEnum.POSTED:
			return <Badge variant='info'>{t('components.badge.status.posted')}</Badge>

		case StatusEnum.MATCHED:
			return <Badge variant='warning'>{t('components.badge.status.inProgress')}</Badge>

		case StatusEnum.DELIVERED:
			return <Badge variant='info'>{t('components.badge.status.delivered')}</Badge>

		case StatusEnum.COMPLETED:
			return <Badge variant='success'>{t('components.badge.status.completed')}</Badge>

		case StatusEnum.CANCELLED:
			return <Badge variant='danger'>{t('components.badge.status.waiting')}</Badge>

		default:
			return <Badge variant='secondary'>-</Badge>
	}
}

export const getStatusBadge = (status: string | undefined, offer: IOfferShort | undefined, role: RoleEnum | undefined, t: Translator) => {
	if (offer) {
		const meta = getOfferStatusMeta(offer, role, t)
		return { variant: meta.variant, label: meta.label, className: meta.highlight ? 'animate-pulse' : undefined }
	}

	const normalized = (status || '').toLowerCase()
	if (normalized.includes(t('components.badge.token.waiting'))) return { variant: 'warning' as const, label: status }
	if (normalized.includes(t('components.badge.token.received'))) return { variant: 'success' as const, label: status }
	if (normalized.includes(t('components.badge.token.cancelPrefix'))) return { variant: 'danger' as const, label: status }
	return { variant: 'secondary' as const, label: status || '-' }
}
