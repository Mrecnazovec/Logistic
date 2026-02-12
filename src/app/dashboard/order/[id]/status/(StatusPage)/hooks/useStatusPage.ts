import { useMemo } from 'react'
import { getOrderStatusLabel, getOrderStatusVariant } from '@/app/dashboard/history/orderStatusConfig'
import { useGetOrder } from '@/hooks/queries/orders/useGet/useGetOrder'
import { useGetOrderStatusHistory } from '@/hooks/queries/orders/useGet/useGetOrderStatusHistory'
import { useI18n } from '@/i18n/I18nProvider'
import { OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import { DEFAULT_LOCALE, EN_LOCALE } from '../constants'
import { buildTimelineSections } from '../lib/buildTimelineSections'

export function useStatusPage() {
	const { t, locale } = useI18n()
	const { orderStatusHistory, isLoading } = useGetOrderStatusHistory()
	const { order, isLoading: isLoadingOrder } = useGetOrder()

	const localeTag = locale === 'en' ? EN_LOCALE : DEFAULT_LOCALE
	const dateFormatter = useMemo(
		() =>
			new Intl.DateTimeFormat(localeTag, {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			}),
		[localeTag],
	)
	const timeFormatter = useMemo(
		() =>
			new Intl.DateTimeFormat(localeTag, {
				hour: '2-digit',
				minute: '2-digit',
			}),
		[localeTag],
	)

	const timelineSections = useMemo(
		() =>
			buildTimelineSections(orderStatusHistory, {
				t,
				dateFormatter,
				timeFormatter,
			}),
		[orderStatusHistory, t, dateFormatter, timeFormatter],
	)

	const orderStatus = order?.status ?? null
	const orderStatusLabel = orderStatus ? getOrderStatusLabel(orderStatus as OrderStatusEnum, t) : t('order.status.notSet')
	const orderStatusVariant = orderStatus ? getOrderStatusVariant(orderStatus as OrderStatusEnum) : 'secondary'

	return {
		t,
		locale,
		order,
		isLoading,
		isLoadingOrder,
		timelineSections,
		hasHistory: timelineSections.length > 0,
		orderStatusLabel,
		orderStatusVariant,
	}
}
