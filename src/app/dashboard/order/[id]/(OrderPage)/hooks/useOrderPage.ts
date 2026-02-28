'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useCancelOrder } from '@/hooks/queries/orders/useCancelOrder'
import { useGetOrder } from '@/hooks/queries/orders/useGet/useGetOrder'
import { usePatchOrder } from '@/hooks/queries/orders/usePatchOrder'
import { useToggleOrderPrivacy } from '@/hooks/queries/orders/useToggleOrderPrivacy'
import { useUpdateOrderStatus } from '@/hooks/queries/orders/useUpdateOrderStatus'
import { useI18n } from '@/i18n/I18nProvider'
import { addLocaleToPath } from '@/i18n/paths'
import { DEFAULT_PLACEHOLDER, formatDateTimeValue } from '@/lib/formatters'
import { OrderDriverStatusEnum, OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import { RoleEnum } from '@/shared/enums/Role.enum'
import type { DriverStatus } from '@/shared/types/Order.interface'
import { useRoleStore } from '@/store/useRoleStore'
import { getFirstDocumentByCategory } from '../lib/getFirstDocumentByCategory'

export const useOrderPage = () => {
	const { t, locale } = useI18n()
	const { order, isLoading } = useGetOrder()
	const { patchOrder } = usePatchOrder()
	const { role } = useRoleStore()
	const { me } = useGetMe()
	const { updateOrderStatus, isLoadingUpdateStatus } = useUpdateOrderStatus()
	const { cancelOrder, isLoadingCancel } = useCancelOrder()
	const { toggleOrderPrivacy, isLoadingToggleOrderPrivacy } = useToggleOrderPrivacy()
	const searchParams = useSearchParams()
	const [cancelOpen, setCancelOpen] = useState(false)

	const driverStatusBadgeMap: Record<
		DriverStatus,
		{ label: string; variant: 'success' | 'warning' | 'info' | 'danger' | 'secondary' }
	> = {
		en_route: { label: t('order.driverStatus.enRoute'), variant: 'info' },
		stopped: { label: t('order.driverStatus.stopped'), variant: 'warning' },
		problem: { label: t('order.driverStatus.problem'), variant: 'danger' },
	}
	const driverStatusEntries = Object.entries(driverStatusBadgeMap) as Array<
		[DriverStatus, (typeof driverStatusBadgeMap)[DriverStatus]]
	>

	const statusFromQuery = searchParams.get('driver_status') as DriverStatus | null
	const currentDriverStatus = order?.driver_status ?? statusFromQuery ?? null
	const driverStatusMeta = currentDriverStatus ? driverStatusBadgeMap[currentDriverStatus] : null
	const hasDriver = Boolean(order?.carrier_name)
	const canRateParticipants = order?.status === OrderStatusEnum.PAID || order?.status === OrderStatusEnum.DELIVERED
	const isCarrier = role === RoleEnum.CARRIER
	const orderId = order ? String(order.id) : ''
	const isHiddenContact = Boolean(order?.roles.customer.hidden)
	const isHiddenByContact = Boolean(order?.roles.customer.hidden_by)
	const canChangeDriverStatus = Boolean(order && isCarrier)
	const orderStatus = order?.status ?? null
	const orderLogisticId = order?.roles?.logistic?.id ?? null
	const isOrderLogistic = Boolean(orderLogisticId && me?.id === orderLogisticId)
	const orderCustomerId = order?.roles?.customer?.id ?? null
	const orderCarrierId = order?.roles?.carrier?.id ?? null
	const isOrderCustomer = Boolean(orderCustomerId && me?.id === orderCustomerId)
	const isOrderCarrier = Boolean(orderCarrierId && me?.id === orderCarrierId)
	const hasLogisticRole = Boolean(order?.roles?.logistic)
	const canInviteDriver = Boolean(order && orderStatus === OrderStatusEnum.NODRIVER && isOrderLogistic)
	const canCancelOrder = Boolean(order && (orderStatus === OrderStatusEnum.PENDING || orderStatus === OrderStatusEnum.NODRIVER))
	const canToggleContacts =
		Boolean(order) && ((role === RoleEnum.LOGISTIC && isOrderLogistic) || (role === RoleEnum.CUSTOMER && isOrderCustomer))
	const isCurrentRoleHidden =
		role === RoleEnum.LOGISTIC
			? Boolean(order?.roles.customer.hidden_by)
			: role === RoleEnum.CUSTOMER
				? Boolean(order?.roles.customer.hidden)
				: false
	const shouldHideCustomerContactsForCarrier = isCarrier && Boolean(order?.roles.customer.hidden)

	const documents = order?.documents ?? []
	const firstOtherDocument = getFirstDocumentByCategory(documents, 'other')
	const hasLoadingDocument = Boolean(order?.loading_datetime)
	const hasUnloadingDocument = Boolean(order?.unloading_datetime)
	const hasOtherDocument = Boolean(firstOtherDocument)
	const firstLoadingDocumentDate = formatDateTimeValue(order?.loading_datetime, DEFAULT_PLACEHOLDER)
	const firstUnloadingDocumentDate = formatDateTimeValue(order?.unloading_datetime, DEFAULT_PLACEHOLDER)
	const firstOtherDocumentDate = formatDateTimeValue(firstOtherDocument?.created_at, DEFAULT_PLACEHOLDER)
	const docsBasePath = orderId ? `/dashboard/order/${orderId}/docs` : ''
	const documentActions = {
		loading: {
			hasDocument: hasLoadingDocument,
			documentDate: firstLoadingDocumentDate,
			href: `${docsBasePath}/loading`,
		},
		unloading: {
			hasDocument: hasUnloadingDocument,
			documentDate: firstUnloadingDocumentDate,
			href: `${docsBasePath}/unloading`,
		},
		other: {
			hasDocument: hasOtherDocument,
			documentDate: firstOtherDocumentDate,
			href: `${docsBasePath}/other`,
		},
	}
	const currentDocumentAction =
		!orderStatus
			? documentActions.loading
			: orderStatus === OrderStatusEnum.IN_PROCESS
				? documentActions.unloading
				: orderStatus === OrderStatusEnum.DELIVERED || orderStatus === OrderStatusEnum.PAID
					? documentActions.other
					: documentActions.loading
	const uploadDocumentLabel = hasLoadingDocument ? t('order.field.unloaded') : t('order.field.loaded')

	const loadingStatusPatchedRef = useRef(false)
	const unloadingStatusPatchedRef = useRef(false)
	const paidStatusPatchedRef = useRef(false)

	useEffect(() => {
		loadingStatusPatchedRef.current = false
		unloadingStatusPatchedRef.current = false
		paidStatusPatchedRef.current = false
	}, [orderId])

	useEffect(() => {
		if (!orderId || !hasLoadingDocument) return
		if (order?.status !== OrderStatusEnum.PENDING) return
		if (loadingStatusPatchedRef.current) return
		loadingStatusPatchedRef.current = true
		patchOrder({ id: orderId, data: { status: OrderStatusEnum.IN_PROCESS } })
	}, [hasLoadingDocument, order?.status, orderId, patchOrder])

	useEffect(() => {
		if (!orderId || !hasUnloadingDocument) return
		if (order?.status !== OrderStatusEnum.IN_PROCESS) return
		if (unloadingStatusPatchedRef.current) return
		unloadingStatusPatchedRef.current = true
		patchOrder({ id: orderId, data: { status: OrderStatusEnum.DELIVERED } })
	}, [hasUnloadingDocument, order?.status, orderId, patchOrder])

	useEffect(() => {
		if (!orderId || !hasOtherDocument) return
		if (order?.status !== OrderStatusEnum.DELIVERED) return
		if (paidStatusPatchedRef.current) return
		paidStatusPatchedRef.current = true
		patchOrder({ id: orderId, data: { status: OrderStatusEnum.PAID } })
	}, [hasOtherDocument, order?.status, orderId, patchOrder])

	const handleShare = async () => {
		const sharePath = order?.share_token ? addLocaleToPath(`/dashboard/order/shared/${order.share_token}`, locale) : ''
		const link = typeof window !== 'undefined' ? (sharePath ? `${window.location.origin}${sharePath}` : window.location.href) : ''

		try {
			if (!link || typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
				throw new Error('Clipboard is not available')
			}
			await navigator.clipboard.writeText(link)
			toast.success(t('order.actions.shareSuccess'))
		} catch {
			toast.error(t('order.actions.shareError'))
		}
	}

	const handleDriverStatusSelect = (nextStatus: OrderDriverStatusEnum) => {
		if (!orderId || nextStatus === currentDriverStatus) return
		updateOrderStatus({ id: orderId, data: { driver_status: nextStatus } })
	}

	const handleCancelConfirm = () => {
		if (!orderId) return
		cancelOrder(orderId, {
			onSuccess: () => setCancelOpen(false),
		})
	}

	const handleToggleContacts = () => {
		if (!orderId) return
		const nextIsHidden =
			role === RoleEnum.LOGISTIC ? !isHiddenByContact : role === RoleEnum.CUSTOMER ? !isHiddenContact : !isHiddenContact
		toggleOrderPrivacy({ id: orderId, isHidden: nextIsHidden })
	}

	const carrierPriceValue = hasLogisticRole ? order?.driver_price : order?.price_total
	const transportPriceValue = isOrderCarrier ? carrierPriceValue : order?.price_total

	return {
		t,
		order,
		role,
		isCarrier,
		isLoading,
		orderStatus,
		driverStatusMeta,
		driverStatusEntries,
		currentDriverStatus,
		canChangeDriverStatus,
		isLoadingUpdateStatus,
		handleDriverStatusSelect,
		hasDriver,
		shouldHideCustomerContactsForCarrier,
		hasLoadingDocument,
		hasUnloadingDocument,
		firstLoadingDocumentDate,
		firstUnloadingDocumentDate,
		docsBasePath,
		transportPriceValue,
		isOrderCustomer,
		isOrderLogistic,
		isOrderCarrier,
		carrierPriceValue,
		canToggleContacts,
		isCurrentRoleHidden,
		handleToggleContacts,
		isLoadingToggleOrderPrivacy,
		handleShare,
		canCancelOrder,
		cancelOpen,
		setCancelOpen,
		handleCancelConfirm,
		isLoadingCancel,
		currentDocumentAction,
		uploadDocumentLabel,
		canInviteDriver,
		canRateParticipants,
	}
}
