import { DEFAULT_PLACEHOLDER, formatDateTimeValue, formatPhoneValue } from '@/lib/formatters'
import type { IOrderDetail } from '@/shared/types/Order.interface'
import type { DriverStatusBadgeMap, SharedOrderDriverStatusMeta, SharedOrderPageTranslator, SharedOrderSection } from '../types/sharedOrderPage.types'

export const withFallbackText = (value?: string | number | null, shouldHide?: boolean) => {
	if (shouldHide) return DEFAULT_PLACEHOLDER
	if (value === null || value === undefined || value === '') return DEFAULT_PLACEHOLDER
	return String(value)
}

export const getDriverStatusMeta = (
	driverStatus: IOrderDetail['driver_status'],
	t: SharedOrderPageTranslator,
): SharedOrderDriverStatusMeta | null => {
	if (!driverStatus) return null

	const map: DriverStatusBadgeMap = {
		en_route: { label: t('order.driverStatus.enRoute'), variant: 'info' },
		stopped: { label: t('order.driverStatus.stopped'), variant: 'warning' },
		problem: { label: t('order.driverStatus.problem'), variant: 'danger' },
	}

	return map[driverStatus]
}

export const buildParticipantSections = (order: IOrderDetail, t: SharedOrderPageTranslator): SharedOrderSection[] => {
	const hasDriver = Boolean(order.carrier_name)

	return [
		{
			title: t('order.section.customerInfo'),
			rows: [
				{
					label: t('order.field.customer'),
					value: withFallbackText(order.roles.customer.name, order.roles.customer.hidden),
					profileId: order.roles.customer.hidden ? null : order.roles.customer.id,
				},
				{ label: t('order.field.company'), value: withFallbackText(order.roles.customer.company) },
				{
					label: t('order.field.phone'),
					value: withFallbackText(formatPhoneValue(order.roles.customer.phone, DEFAULT_PLACEHOLDER), order.roles.customer.hidden),
				},
			],
		},
		{
			title: t('order.section.logisticInfo'),
			rows: [
				{
					label: t('order.field.logistic'),
					value: withFallbackText(order.roles.logistic?.name, order.roles.logistic?.hidden),
					profileId: order.roles.logistic?.hidden ? null : (order.roles.logistic?.id ?? null),
				},
				{ label: t('order.field.company'), value: withFallbackText(order.roles.logistic?.company) },
				{
					label: t('order.field.phone'),
					value: withFallbackText(formatPhoneValue(order.roles.logistic?.phone, DEFAULT_PLACEHOLDER), order.roles.logistic?.hidden),
				},
			],
		},
		{
			title: t('order.section.carrierInfo'),
			rows: [
				{
					label: t('order.field.carrier'),
					value: hasDriver
						? withFallbackText(order.roles.carrier?.name, order.roles.carrier?.hidden)
						: DEFAULT_PLACEHOLDER,
					profileId: order.roles.carrier?.hidden || !hasDriver ? null : (order.roles.carrier?.id ?? null),
				},
				{ label: t('order.field.company'), value: withFallbackText(order.roles.carrier?.company) },
				{
					label: t('order.field.phone'),
					value: withFallbackText(formatPhoneValue(order.roles.carrier?.phone, DEFAULT_PLACEHOLDER), order.roles.carrier?.hidden),
				},
			],
		},
	]
}

export const getDocumentDisplayValue = (datetime: string | null | undefined) => ({
	hasDocument: Boolean(datetime),
	formattedDate: formatDateTimeValue(datetime, DEFAULT_PLACEHOLDER),
})
