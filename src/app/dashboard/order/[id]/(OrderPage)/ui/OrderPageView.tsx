"use client"

import Link from 'next/link'
import dynamic from 'next/dynamic'

import { getOrderStatusLabel, getOrderStatusVariant } from '@/app/dashboard/history/orderStatusConfig'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmIrreversibleActionModal } from '@/components/ui/modals/ConfirmIrreversibleActionModal'
import { OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { useOrderPage } from '../hooks/useOrderPage'
import { OrderDriverStatusFloating } from './OrderDriverStatusFloating'
import { OrderFinanceSection } from './OrderFinanceSection'
import { OrderPageSkeleton } from './OrderPageSkeleton'
import { OrderParticipantsGrid } from './OrderParticipantsGrid'
import { OrderTripGrid } from './OrderTripGrid'

const InviteDriverModal = dynamic(() =>
	import('@/components/ui/modals/InviteDriverModal').then((mod) => mod.InviteDriverModal),
)
const OrderRatingModal = dynamic(() =>
	import('@/components/ui/modals/OrderRatingModal').then((mod) => mod.OrderRatingModal),
)

export function OrderPageView() {
	const state = useOrderPage()
	const {
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
	} = state

	const renderCarrierUploadButton = () => {
		if (role !== RoleEnum.CARRIER) return null
		if (currentDocumentAction.hasDocument) return null
		const canUpload =
			orderStatus !== OrderStatusEnum.CANCELED &&
			orderStatus !== OrderStatusEnum.DELIVERED &&
			orderStatus !== OrderStatusEnum.PAID
		if (!canUpload) return null

		return (
			<Button asChild variant='outline'>
				<Link href={currentDocumentAction.href}>{uploadDocumentLabel}</Link>
			</Button>
		)
	}

	if (isLoading) return <OrderPageSkeleton />
	if (!order) {
		return (
			<div className='flex h-full w-full items-center justify-center rounded-4xl bg-background p-8 text-center text-muted-foreground'>
				{t('order.unavailable')}
			</div>
		)
	}

	const orderStatusBadge = orderStatus ? (
		<Badge variant={getOrderStatusVariant(orderStatus)}>{getOrderStatusLabel(orderStatus, t)}</Badge>
	) : (
		<Badge variant='secondary'>{t('order.status.notSet')}</Badge>
	)

	return (
		<div className='space-y-6 rounded-4xl bg-background p-8'>
			<div className='flex flex-wrap items-center gap-3'>
				{orderStatusBadge}
				<UuidCopy id={order.id} isPlaceholder />
			</div>

			<OrderParticipantsGrid
				t={t}
				order={order}
				hasDriver={hasDriver}
				shouldHideCustomerContactsForCarrier={shouldHideCustomerContactsForCarrier}
			/>

			<div className='h-px w-full bg-grayscale' />

			<OrderTripGrid
				t={t}
				order={order}
				hasLoadingDocument={hasLoadingDocument}
				hasUnloadingDocument={hasUnloadingDocument}
				firstLoadingDocumentDate={firstLoadingDocumentDate}
				firstUnloadingDocumentDate={firstUnloadingDocumentDate}
				docsBasePath={docsBasePath}
				isCarrier={isCarrier}
				driverStatusMeta={driverStatusMeta}
				transportPriceValue={transportPriceValue}
			/>

			<div className='h-px w-full bg-grayscale' />

			<OrderFinanceSection
				t={t}
				order={order}
				isOrderCustomer={isOrderCustomer}
				isOrderLogistic={isOrderLogistic}
				isOrderCarrier={isOrderCarrier}
				carrierPriceValue={carrierPriceValue}
			/>

			<div className='flex flex-wrap items-center justify-end gap-3'>
				{canToggleContacts && (
					<Button type='button' variant='outline' onClick={handleToggleContacts} disabled={isLoadingToggleOrderPrivacy}>
						{isCurrentRoleHidden ? t('order.actions.showContacts') : t('order.actions.hideContacts')}
					</Button>
				)}
				{!isCarrier && (
					<Button type='button' variant='outline' onClick={handleShare}>
						{t('order.actions.share')}
					</Button>
				)}
				{canCancelOrder && (
					<Button
						type='button'
						onClick={() => setCancelOpen(true)}
						disabled={isLoadingCancel}
						className='bg-error-500 text-white hover:bg-error-400'
					>
						{t('order.actions.cancel')}
					</Button>
				)}
				{renderCarrierUploadButton()}
				{canInviteDriver && <InviteDriverModal order={order} canInviteById={canInviteDriver} />}
				{canRateParticipants && <OrderRatingModal order={order} currentRole={role ?? null} disabled={isLoading} />}
			</div>

			<ConfirmIrreversibleActionModal
				open={cancelOpen}
				onOpenChange={setCancelOpen}
				onConfirm={handleCancelConfirm}
				isConfirmLoading={isLoadingCancel}
				titleKey='order.actions.cancelConfirmTitle'
				descriptionKey='order.actions.cancelConfirmDescription'
				cancelKey='order.actions.cancelConfirmCancel'
				confirmKey='order.actions.cancelConfirmConfirm'
			/>

			<OrderDriverStatusFloating
				t={t}
				canChangeDriverStatus={canChangeDriverStatus}
				isLoadingUpdateStatus={isLoadingUpdateStatus}
				driverStatusMeta={driverStatusMeta}
				driverStatusEntries={driverStatusEntries}
				currentDriverStatus={currentDriverStatus}
				onSelectStatus={handleDriverStatusSelect}
			/>
		</div>
	)
}
