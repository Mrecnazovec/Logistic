'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'

import { DASHBOARD_URL } from '@/config/url.config'
import { useGenerateLoadInvite } from '@/hooks/queries/loads/useGenerateLoadInvite'
import { useInviteOffer } from '@/hooks/queries/offers/useAction/useInviteOffer'
import { formatCurrencyPerKmValue, formatCurrencyValue } from '@/lib/currency'
import { PaymentMethodEnum } from '@/shared/enums/PaymentMethod.enum'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import { ICargoList } from '@/shared/types/CargoList.interface'

type Translator = (key: string, params?: Record<string, string | number>) => string

export function useDeskInviteModalState(selectedRow: ICargoList | undefined, locale: string, t: Translator) {
	const [shareCopyStatus, setShareCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')
	const [carrierId, setCarrierId] = useState('')
	const { generateLoadInvite, invite, isLoadingGenerate, resetInvite } = useGenerateLoadInvite()
	const { inviteOffer, isLoadingInviteOffer } = useInviteOffer()
	const dateLocale = locale === 'en' ? enUS : ru

	const transportName = selectedRow ? getTransportName(t, selectedRow.transport_type) || '-' : null
	const formattedPrice = formatCurrencyValue(selectedRow?.price_value, selectedRow?.price_currency)
	const formattedPricePerKm = formatCurrencyPerKmValue(selectedRow?.price_per_km, selectedRow?.price_currency)
	const inviteToken = invite?.token

	const shareLink =
		inviteToken && typeof window !== 'undefined'
			? `${window.location.origin}${DASHBOARD_URL.desk(`invite/${inviteToken}`)}`
			: ''

	const formattedLoadDate = selectedRow
		? format(selectedRow.load_date, 'dd.MM.yyyy', { locale: dateLocale })
		: '-'
	const formattedDeliveryDate = selectedRow?.delivery_date
		? format(selectedRow.delivery_date, 'dd.MM.yyyy', { locale: dateLocale })
		: '-'

	const handleModalOpenChange = (isOpen: boolean, onOpenChange?: (open: boolean) => void) => {
		if (!isOpen) {
			setShareCopyStatus('idle')
			resetInvite()
		}
		onOpenChange?.(isOpen)
	}

	const handleInviteCarrier = () => {
		if (!selectedRow?.id) {
			toast.error(t('components.deskInvite.errors.noCargo'))
			return
		}

		const parsedCarrierId = Number(carrierId)
		if (!carrierId || Number.isNaN(parsedCarrierId)) {
			toast.error(t('components.deskInvite.errors.invalidId'))
			return
		}

		inviteOffer(
			{
				cargo: selectedRow.id,
				invited_user_id: parsedCarrierId,
				price_currency: selectedRow.price_currency ?? 'UZS',
				price_value: selectedRow.price_value ?? undefined,
				payment_method: (selectedRow as { payment_method?: PaymentMethodEnum }).payment_method ?? PaymentMethodEnum.CASH,
			},
			{
				onSuccess: () => setCarrierId(''),
			},
		)
	}

	const handleGenerateInviteLink = () => {
		if (!selectedRow?.uuid) {
			toast.error(t('components.deskInvite.errors.noData'))
			return
		}

		generateLoadInvite(selectedRow.uuid)
	}

	const handleCopyShareLink = async () => {
		if (!shareLink) {
			toast.error(t('components.deskInvite.errors.generateFirst'))
			return
		}

		try {
			await navigator.clipboard.writeText(shareLink)
			setShareCopyStatus('copied')
			toast.success(t('components.deskInvite.copySuccess'))
		} catch (error) {
			console.error(error)
			setShareCopyStatus('error')
			toast.error(t('components.deskInvite.copyError'))
		}
	}

	return {
		transportName,
		formattedPrice,
		formattedPricePerKm,
		shareLink,
		shareCopyStatus,
		carrierId,
		setCarrierId,
		isLoadingGenerate,
		isLoadingInviteOffer,
		formattedLoadDate,
		formattedDeliveryDate,
		handleModalOpenChange,
		handleInviteCarrier,
		handleGenerateInviteLink,
		handleCopyShareLink,
	}
}

