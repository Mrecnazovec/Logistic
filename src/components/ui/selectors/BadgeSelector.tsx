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

const isCancelledStatus = (status?: string) => {
	const normalized = (status || '').toLowerCase()
	return normalized.includes('отменено') || normalized.includes('declin') || normalized.includes('cancel')
}

const getCounterpartyLabel = (role?: RoleEnum) => (role === RoleEnum.CARRIER ? 'заказчика' : 'заказчика')

export const getOfferStatusMeta = (offer?: IOfferShort, role?: RoleEnum): OfferStatusMeta => {
	if (!offer) return { variant: 'secondary', label: '-' }

	const isCancelled = isCancelledStatus(offer.status_display)
	if (offer.invite_token) {
		return {
			variant: 'violet',
			label: 'Требуется водитель',
			note: 'Приглашение доступно для принятия',
			requireDecision: true,
			highlight: true,
		}
	}
	if (offer.message === 'Приглашение через заказ') {
		return {
			variant: 'outline',
			label: 'Предложение истекло',
			note: 'Время предложения истекло или вы приняли приглашение',
		}
	}
	const counterpartyAccepted = offer.accepted_by_customer
	const selfAccepted = role === RoleEnum.CARRIER ? offer.accepted_by_carrier : offer.accepted_by_logistic

	if (counterpartyAccepted && selfAccepted) {
		return {
			variant: 'success',
			label: 'Согласовано',
			note: 'Заказ создан, перейдите во вкладку мои грузы',
		}
	}

	if (isCancelled) {
		return {
			variant: 'danger',
			label: 'Отказано',
			note: 'Предложение было отклонено',
		}
	}

	if (counterpartyAccepted && !selfAccepted || offer.response_status === 'counter_from_customer' && !selfAccepted) {
		return {
			variant: 'violet',
			label: 'Требуется ответ',
			note: 'Предложение ожидает вашего решения',
			requireDecision: true,
			highlight: true,
		}
	}

	return {
		variant: 'warning',
		label: 'В ожидании ответа',
		// requireDecision: true,

		note: `Ожидайте ответа ${getCounterpartyLabel(role)}`,
	}
}

export function BadgeSelector({ status }: BadgeProps) {
	switch (status) {
		case StatusEnum.POSTED:
			return (
				<Badge variant='info'>
					Опубликована
				</Badge>
			)

		case StatusEnum.MATCHED:
			return (
				<Badge variant='warning'>
					В работе
				</Badge>
			)

		case StatusEnum.DELIVERED:
			return (
				<Badge variant='info'>
					Доставлено
				</Badge>
			)

		case StatusEnum.COMPLETED:
			return (
				<Badge variant='success'>
					Ответ получен
				</Badge>
			)

		case StatusEnum.CANCELLED:
			return (
				<Badge variant='danger'>
					Ожидает ответа
				</Badge>
			)

		default:
			return <Badge variant='secondary'>-</Badge>
	}
}

export const getStatusBadge = (status?: string, offer?: IOfferShort, role?: RoleEnum) => {
	if (offer) {
		const meta = getOfferStatusMeta(offer, role)
		return { variant: meta.variant, label: meta.label, className: meta.highlight ? 'animate-pulse' : undefined }
	}

	const normalized = (status || '').toLowerCase()
	if (normalized.includes('ожидает')) return { variant: 'warning' as const, label: status }
	if (normalized.includes('получен')) return { variant: 'success' as const, label: status }
	if (normalized.includes('отм')) return { variant: 'danger' as const, label: status }
	return { variant: 'secondary' as const, label: status || '-' }
}
