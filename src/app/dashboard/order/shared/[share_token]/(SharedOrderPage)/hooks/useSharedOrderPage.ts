import { getOrderStatusLabel, getOrderStatusVariant } from '@/app/dashboard/history/orderStatusConfig'
import { useGetSharedOrder } from '@/hooks/queries/orders/useGet/useGetSharedOrder'
import { useI18n } from '@/i18n/I18nProvider'
import { buildParticipantSections, getDocumentDisplayValue, getDriverStatusMeta } from '../lib/sharedOrderPage.utils'

export function useSharedOrderPage() {
	const { t } = useI18n()
	const { order, isLoading } = useGetSharedOrder()

	const statusLabel = order?.status ? getOrderStatusLabel(order.status, t) : t('order.status.notSet')
	const statusVariant = order?.status ? getOrderStatusVariant(order.status) : 'secondary'
	const driverStatusMeta = order ? getDriverStatusMeta(order.driver_status, t) : null
	const participantSections = order ? buildParticipantSections(order, t) : []
	const loadingDocument = order ? getDocumentDisplayValue(order.loading_datetime) : null
	const unloadingDocument = order ? getDocumentDisplayValue(order.unloading_datetime) : null

	return {
		t,
		order,
		isLoading,
		statusLabel,
		statusVariant,
		driverStatusMeta,
		participantSections,
		loadingDocument,
		unloadingDocument,
	}
}
