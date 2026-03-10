import { PaymentMethodSelector } from '@/shared/enums/PaymentMethod.enum'
import type { IAgreementDetail } from '@/shared/types/Agreement.interface'
import { AGREEMENT_STATUS_CLASSNAMES, EMPTY_VALUE } from '../constants/agreementPage.constants'
import type { AgreementTranslator } from '../types/agreementPage.types'

export const formatCountdown = (ms: number) => {
	const totalSeconds = Math.max(Math.floor(ms / 1000), 0)
	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	const seconds = totalSeconds % 60

	if (hours > 0) {
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
	}

	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export const withFallback = (value?: string | number | null) =>
	value === null || value === undefined || value === '' ? EMPTY_VALUE : String(value)

export const getAgreementStatusMeta = (status: IAgreementDetail['status'], t: AgreementTranslator) => {
	return {
		label: t(`order.agreement.status.${status}`),
		className: AGREEMENT_STATUS_CLASSNAMES[status] ?? AGREEMENT_STATUS_CLASSNAMES.pending,
	}
}

export const getTotalDistance = (distanceKm: unknown, t: AgreementTranslator) => {
	const value = Number(distanceKm)
	return Number.isFinite(value) ? `${value.toFixed(2)} ${t('order.unit.km')}` : EMPTY_VALUE
}

export const getPaymentMethod = (paymentMethod: IAgreementDetail['payment_method'], t: AgreementTranslator) => {
	if (!paymentMethod) return EMPTY_VALUE
	const nameKey = PaymentMethodSelector.find((method) => method.type === paymentMethod)?.nameKey
	return nameKey ? t(nameKey) : EMPTY_VALUE
}
