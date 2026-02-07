'use client'

import { DASHBOARD_URL, PUBLIC_URL } from '@/config/url.config'
import { useLoadInvite } from '@/hooks/queries/loads/useLoadInvite'
import { useAcceptOffer } from '@/hooks/queries/offers/useAction/useAcceptOffer'
import { useCounterOffer } from '@/hooks/queries/offers/useAction/useCounterOffer'
import { useRejectOffer } from '@/hooks/queries/offers/useAction/useRejectOffer'
import { useI18n } from '@/i18n/I18nProvider'
import type { PriceCurrencyCode } from '@/lib/currency'
import { formatCurrencyPerKmValue, formatCurrencyValue } from '@/lib/currency'
import { getAccessToken } from '@/services/auth/auth-token.service'
import { PaymentMethodEnum } from '@/shared/enums/PaymentMethod.enum'
import { getTransportName } from '@/shared/enums/TransportType.enum'
import { AxiosError } from 'axios'
import { format } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'

const EMPTY = '-'

export function useInvitePage() {
	const { t, locale } = useI18n()
	const params = useParams<{ token: string }>()
	const token = params?.token
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const accessToken = getAccessToken()
	const returnPath = useMemo(() => {
		const query = searchParams.toString()
		const basePath = token ? DASHBOARD_URL.desk(`invite/${token}`) : pathname
		return query ? `${basePath}?${query}` : basePath
	}, [pathname, searchParams, token])
	const authHref = useMemo(() => `${PUBLIC_URL.auth()}?next=${encodeURIComponent(returnPath)}`, [returnPath])

	const { invite, isLoadingInvite, inviteError, refetchInvite } = useLoadInvite(token, { enabled: Boolean(accessToken) })
	const inviteErrorStatus = useMemo(() => {
		if (!inviteError) return null
		if (inviteError instanceof AxiosError || (inviteError as AxiosError).isAxiosError) {
			return (inviteError as AxiosError).response?.status ?? null
		}
		return null
	}, [inviteError])

	const dateLocale = locale === 'en' ? enUS : ru
	const cargo = invite?.cargo
	const expiryText = invite?.expires_at ? format(new Date(invite.expires_at), 'dd.MM.yyyy HH:mm', { locale: dateLocale }) : null
	const defaultPriceValue = cargo?.price_value ?? ''
	const defaultCurrencyValue = (cargo?.price_currency as PriceCurrencyCode | '') ?? ''

	const { acceptOffer, isLoadingAcceptOffer } = useAcceptOffer()
	const { counterOffer, isLoadingCounterOffer } = useCounterOffer()
	const { rejectOffer, isLoadingRejectOffer } = useRejectOffer()

	const inviteWithOfferId = invite as
		| (typeof invite & {
				offer_id?: number
				offer?: { id?: number; payment_method?: PaymentMethodEnum }
				id?: number
				payment_method?: PaymentMethodEnum
		  })
		| null
	const inviteOfferId = inviteWithOfferId?.offer_id ?? inviteWithOfferId?.offer?.id ?? inviteWithOfferId?.id ?? null
	const defaultPaymentMethod = inviteWithOfferId?.payment_method ?? inviteWithOfferId?.offer?.payment_method ?? null

	const formattedLoadDate = cargo?.load_date ? format(new Date(cargo.load_date), 'dd.MM.yyyy', { locale: dateLocale }) : EMPTY
	const formattedDeliveryDate = cargo?.delivery_date ? format(new Date(cargo.delivery_date), 'dd.MM.yyyy', { locale: dateLocale }) : EMPTY
	const transport = cargo ? getTransportName(t, cargo.transport_type) || cargo.transport_type || EMPTY : EMPTY
	const formattedPrice = formatCurrencyValue(cargo?.price_value, cargo?.price_currency as PriceCurrencyCode | undefined)
	const formattedPricePerKm = formatCurrencyPerKmValue(cargo?.price_per_km, cargo?.price_currency as PriceCurrencyCode | undefined)
	const isProcessing = isLoadingInvite || isLoadingAcceptOffer || isLoadingCounterOffer || isLoadingRejectOffer

	useEffect(() => {
		if (!accessToken) router.replace(authHref)
	}, [accessToken, authHref, router])

	const onAccept = (offerId: number | null) => {
		if (!offerId) {
			toast.error(t('desk.invite.offerIdMissing'))
			return
		}
		acceptOffer(String(offerId), {
			onSuccess: () => router.push(DASHBOARD_URL.desk('my')),
		})
	}

	const onCounter = (payload: { offerId: number | null; data: any }) => {
		if (!payload.offerId) {
			toast.error(t('desk.invite.offerIdMissing'))
			return
		}
		counterOffer(
			{ id: String(payload.offerId), data: payload.data },
			{
				onSuccess: () => router.push(DASHBOARD_URL.desk('my')),
			},
		)
	}

	const onReject = (offerId: number | null) => {
		if (!offerId) {
			toast.error(t('desk.invite.offerIdMissing'))
			return
		}
		rejectOffer(String(offerId), {
			onSuccess: () => router.push(DASHBOARD_URL.desk('my')),
		})
	}

	return {
		t,
		authHref,
		accessToken,
		isLoadingInvite,
		inviteErrorStatus,
		refetchInvite,
		invite,
		cargo,
		expiryText,
		formattedLoadDate,
		formattedDeliveryDate,
		transport,
		formattedPrice,
		formattedPricePerKm,
		defaultPriceValue,
		defaultCurrencyValue,
		defaultPaymentMethod,
		inviteOfferId,
		isProcessing,
		isLoadingAcceptOffer,
		isLoadingCounterOffer,
		isLoadingRejectOffer,
		onAccept,
		onCounter,
		onReject,
	}
}
