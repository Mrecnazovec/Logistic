"use client"

import { getOfferStatusMeta } from '@/components/ui/selectors/BadgeSelector'
import { useGetIncomingOffers } from '@/hooks/queries/offers/useGet/useGetIncomingOffers'
import { useGetMyOffers } from '@/hooks/queries/offers/useGet/useGetMyOffers'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useI18n } from '@/i18n/I18nProvider'
import { RoleEnum } from '@/shared/enums/Role.enum'
import type { IOfferShort } from '@/shared/types/Offer.interface'
import { useOfferRealtimeStore } from '@/store/useOfferRealtimeStore'
import { useRoleStore } from '@/store/useRoleStore'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { useSearchForm } from '../../Searching/useSearchForm'
import { getDeskIncomeColumns } from '../../table/DeskIncomeColumns'
import { getDeskMyColumns } from '../../table/DeskMyColumns'

export type OfferDecisionContext = 'my_offers' | 'offers_to_me'
export type OpenDecisionOptions = {
	forceFull?: boolean
	decisionContext?: OfferDecisionContext
}

function useDecisionModal(role: RoleEnum | undefined, t: (key: string, params?: Record<string, string | number>) => string) {
	const [selectedOffer, setSelectedOffer] = useState<IOfferShort | undefined>()
	const [selectedDecisionContext, setSelectedDecisionContext] = useState<OfferDecisionContext | undefined>()
	const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)
	const [decisionNote, setDecisionNote] = useState<string | undefined>()
	const [decisionActionable, setDecisionActionable] = useState(false)

	const openDecisionModal = useCallback((offer: IOfferShort, options?: OpenDecisionOptions) => {
		const meta = getOfferStatusMeta(offer, role, t)
		setSelectedOffer(offer)
		setSelectedDecisionContext(options?.decisionContext)
		if (options?.forceFull) {
			setDecisionNote(undefined)
			setDecisionActionable(true)
		} else {
			setDecisionNote(meta.note)
			setDecisionActionable(Boolean(meta.requireDecision))
		}
		setIsDecisionModalOpen(true)
	}, [role, t])

	const closeDecisionModal = useCallback((open: boolean) => {
		setIsDecisionModalOpen(open)
		if (!open) {
			setSelectedOffer(undefined)
			setSelectedDecisionContext(undefined)
			setDecisionNote(undefined)
			setDecisionActionable(false)
		}
	}, [])

	return {
		selectedOffer,
		selectedDecisionContext,
		isDecisionModalOpen,
		decisionNote,
		decisionActionable,
		openDecisionModal,
		closeDecisionModal,
	}
}

export function useDeskMyPage() {
	const { data, isLoading } = useGetIncomingOffers()
	const { data: dataMy, isLoading: isLoadingMy } = useGetMyOffers()
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const tableType = useTableTypeStore((state) => state.tableType)
	const role = useRoleStore((state) => state.role)
	const { t } = useI18n()
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const unreadOffers = useOfferRealtimeStore((state) => state.unreadOffers)
	const clearOffer = useOfferRealtimeStore((state) => state.clearOffer)
	const {
		selectedOffer,
		selectedDecisionContext,
		isDecisionModalOpen,
		decisionNote,
		decisionActionable,
		openDecisionModal,
		closeDecisionModal,
	} = useDecisionModal(role ?? undefined, t)

	const tabs = useMemo(
		() =>
			role === RoleEnum.LOGISTIC
				? [
						{ value: 'drivers', label: t('deskMy.tabs.myOffers') },
						{ value: 'desk', label: t('deskMy.tabs.offersToMe') },
					]
				: [
						{ value: 'drivers', label: t('deskMy.tabs.offersToMe') },
						{ value: 'desk', label: t('deskMy.tabs.myOffers') },
					],
		[role, t],
	)

	const unreadOfferIds = useMemo(() => new Set(unreadOffers.map((item) => item.offerId)), [unreadOffers])
	const handleOpenDecision = useCallback((offer: IOfferShort, options?: OpenDecisionOptions) => {
		clearOffer(offer.id)
		openDecisionModal(offer, options)
	}, [clearOffer, openDecisionModal])

	const handleOpenDecisionDeskTab = useCallback((offer: IOfferShort, options?: OpenDecisionOptions) => {
		handleOpenDecision(offer, {
			...options,
			decisionContext: role === RoleEnum.LOGISTIC ? 'offers_to_me' : 'my_offers',
		})
	}, [handleOpenDecision, role])

	const handleOpenDecisionDriversTab = useCallback((offer: IOfferShort, options?: OpenDecisionOptions) => {
		handleOpenDecision(offer, {
			...options,
			decisionContext: role === RoleEnum.LOGISTIC ? 'my_offers' : 'offers_to_me',
		})
	}, [handleOpenDecision, role])

	const deskColumns = useMemo(() => getDeskMyColumns(t, handleOpenDecisionDeskTab, unreadOfferIds), [handleOpenDecisionDeskTab, t, unreadOfferIds])
	const incomeColumns = useMemo(() => getDeskIncomeColumns(t, handleOpenDecisionDriversTab, unreadOfferIds), [handleOpenDecisionDriversTab, t, unreadOfferIds])

	const deskResults = data?.results ?? []
	const myResults = dataMy?.results ?? []
	const hasUnreadDesk = deskResults.some((offer) => unreadOfferIds.has(offer.id))
	const hasUnreadMy = myResults.some((offer) => unreadOfferIds.has(offer.id))

	const deskPagination = deskResults.length
		? { next: data?.next, previous: data?.previous, totalCount: data?.count, pageSize: deskResults.length }
		: undefined
	const myPagination = myResults.length
		? { next: dataMy?.next, previous: dataMy?.previous, totalCount: dataMy?.count, pageSize: myResults.length }
		: undefined

	const handleTabChange = useCallback(() => {
		const params = new URLSearchParams(searchParams.toString())
		params.delete('page')
		const query = params.toString()
		router.replace(query ? `${pathname}?${query}` : pathname)
	}, [pathname, router, searchParams])

	return {
		t,
		form,
		onSubmit,
		isDesktop,
		tableType,
		role,
		tabs,
		hasUnreadDesk,
		hasUnreadMy,
		deskColumns,
		incomeColumns,
		deskResults,
		myResults,
		data,
		dataMy,
		isLoading,
		isLoadingMy,
		unreadOfferIds,
		deskPagination,
		myPagination,
		handleOpenDecision,
		handleOpenDecisionDeskTab,
		handleOpenDecisionDriversTab,
		handleTabChange,
		selectedOffer,
		selectedDecisionContext,
		isDecisionModalOpen,
		decisionNote,
		decisionActionable,
		closeDecisionModal,
	}
}
