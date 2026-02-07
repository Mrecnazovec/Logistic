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
import { useMemo, useState } from 'react'
import { useSearchForm } from '../../Searching/useSearchForm'
import { getDeskIncomeColumns } from '../../table/DeskIncomeColumns'
import { getDeskMyColumns } from '../../table/DeskMyColumns'

function useDecisionModal(role: RoleEnum | undefined, t: (key: string, params?: Record<string, string | number>) => string) {
	const [selectedOffer, setSelectedOffer] = useState<IOfferShort | undefined>()
	const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)
	const [decisionNote, setDecisionNote] = useState<string | undefined>()
	const [decisionActionable, setDecisionActionable] = useState(false)

	const openDecisionModal = (offer: IOfferShort, options?: { forceFull?: boolean }) => {
		const meta = getOfferStatusMeta(offer, role, t)
		setSelectedOffer(offer)
		if (options?.forceFull) {
			setDecisionNote(undefined)
			setDecisionActionable(true)
		} else {
			setDecisionNote(meta.note)
			setDecisionActionable(Boolean(meta.requireDecision))
		}
		setIsDecisionModalOpen(true)
	}

	const closeDecisionModal = (open: boolean) => {
		setIsDecisionModalOpen(open)
		if (!open) {
			setSelectedOffer(undefined)
			setDecisionNote(undefined)
			setDecisionActionable(false)
		}
	}

	return {
		selectedOffer,
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
	const deskColumns = useMemo(() => getDeskMyColumns(t, openDecisionModal, unreadOfferIds), [openDecisionModal, t, unreadOfferIds])
	const incomeColumns = useMemo(() => getDeskIncomeColumns(t, openDecisionModal, unreadOfferIds), [openDecisionModal, t, unreadOfferIds])

	const deskResults = data?.results ?? []
	const myResults = dataMy?.results ?? []
	const hasUnreadDesk = deskResults.some((offer) => unreadOfferIds.has(offer.id))
	const hasUnreadMy = myResults.some((offer) => unreadOfferIds.has(offer.id))

	const handleOpenDecision = (offer: IOfferShort, options?: { forceFull?: boolean }) => {
		clearOffer(offer.id)
		openDecisionModal(offer, options)
	}

	const deskPagination = deskResults.length
		? { next: data?.next, previous: data?.previous, totalCount: data?.count, pageSize: deskResults.length }
		: undefined
	const myPagination = myResults.length
		? { next: dataMy?.next, previous: dataMy?.previous, totalCount: dataMy?.count, pageSize: myResults.length }
		: undefined

	const handleTabChange = () => {
		const params = new URLSearchParams(searchParams.toString())
		params.delete('page')
		const query = params.toString()
		router.replace(query ? `${pathname}?${query}` : pathname)
	}

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
		handleTabChange,
		selectedOffer,
		isDecisionModalOpen,
		decisionNote,
		decisionActionable,
		closeDecisionModal,
	}
}
