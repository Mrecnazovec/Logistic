"use client"

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { getOfferStatusMeta } from '@/components/ui/selectors/BadgeSelector'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { EmptyTableState, LoaderTable } from '@/components/ui/table/TableStates'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { useGetIncomingOffers } from '@/hooks/queries/offers/useGet/useGetIncomingOffers'
import { useGetMyOffers } from '@/hooks/queries/offers/useGet/useGetMyOffers'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useI18n } from '@/i18n/I18nProvider'
import { RoleEnum } from '@/shared/enums/Role.enum'
import type { IOfferShort } from '@/shared/types/Offer.interface'
import { useRoleStore } from '@/store/useRoleStore'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { useOfferRealtimeStore } from '@/store/useOfferRealtimeStore'
import dynamic from 'next/dynamic'
import { usePathname, useSearchParams } from 'next/navigation'
import { useSearchForm } from './Searching/useSearchForm'
import { DeskMyCardList } from './components/DeskIncomeCardList'
import { getDeskIncomeColumns } from './table/DeskIncomeColumns'
import { getDeskMyColumns } from './table/DeskMyColumns'

const OfferDecisionModal = dynamic(() => import('@/components/ui/modals/OfferDecisionModal').then((mod) => mod.OfferDecisionModal))

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

export function DeskMyPage() {
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

	const myDesktopContent = isLoadingMy ? (
		<LoaderTable />
	) : !myResults.length ? (
		<EmptyTableState />
	) : tableType === 'card' ? (
		<DeskMyCardList cargos={myResults} serverPagination={deskPagination} onOpenDecision={handleOpenDecision} role={role} unreadOfferIds={unreadOfferIds} />
	) : (
		<DataTable
			columns={deskColumns}
			data={myResults}
			serverPagination={{ next: dataMy?.next, previous: dataMy?.previous, totalCount: dataMy?.count }}
			onRowClick={handleOpenDecision}
		/>
	)

	const incomingDesktopContent = isLoading ? (
		<LoaderTable />
	) : !deskResults.length ? (
		<EmptyTableState />
	) : tableType === 'card' ? (
		<DeskMyCardList cargos={deskResults} serverPagination={myPagination} onOpenDecision={handleOpenDecision} role={role} unreadOfferIds={unreadOfferIds} />
	) : (
		<DataTable
			columns={incomeColumns}
			data={deskResults}
			serverPagination={{ next: data?.next, previous: data?.previous, totalCount: data?.count }}
			onRowClick={handleOpenDecision}
		/>
	)

	const handleTabChange = (tab: string) => {
		const params = new URLSearchParams(searchParams.toString())
		params.delete('page')
		const query = params.toString()
		router.replace(query ? `${pathname}?${query}` : pathname)
	}

	return (
		<div className='flex h-full flex-col md:gap-4'>
			<div className='w-full rounded-4xl bg-background px-4 py-8 max-md:mb-6 max-md:hidden'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<SearchFields
							form={form}
							showOffersFilter
							showWeightRadiusFields={false}
							uuidPlaceholder={t('components.search.uuidPlaceholder.offer')}
							onSubmit={form.handleSubmit(onSubmit)}
						/>
					</form>
				</Form>
			</div>

			<Tabs
				defaultValue='drivers'
				className={isDesktop ? 'flex-1' : 'h-full rounded-4xl xs:bg-background'}
				onValueChange={handleTabChange}
			>
				<div className='flex items-end justify-between'>
					<TabsList className='-mb-2 bg-transparent'>
						{tabs.map((tab) => {
							const showDot = tab.value === 'desk' ? hasUnreadMy : hasUnreadDesk
							return (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className='rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none'
							>
								<span className='relative'>
									{tab.label}
									{showDot ? <span className='absolute -top-1 -right-2 size-2 rounded-full bg-error-500' /> : null}
								</span>
							</TabsTrigger>
						)})}
					</TabsList>
					{isDesktop && (
						<div className='ml-auto'>
							<TableTypeSelector />
						</div>
					)}
				</div>

				<TabsContent value='desk'>
					{isDesktop ? (
						myDesktopContent
					) : (
						<DeskMyCardList cargos={myResults} serverPagination={deskPagination} onOpenDecision={handleOpenDecision} role={role} unreadOfferIds={unreadOfferIds} />
					)}
				</TabsContent>
				<TabsContent value='drivers'>
					{isDesktop ? (
						incomingDesktopContent
					) : isLoading ? (
						<LoaderTable />
					) : deskResults.length ? (
						<DeskMyCardList cargos={deskResults} serverPagination={myPagination} onOpenDecision={handleOpenDecision} role={role} unreadOfferIds={unreadOfferIds} />
					) : (
						<EmptyTableState />
					)}
				</TabsContent>
			</Tabs>

			<OfferDecisionModal
				key={selectedOffer?.id ?? 'empty'}
				offer={selectedOffer}
				open={isDecisionModalOpen}
				onOpenChange={closeDecisionModal}
				statusNote={decisionNote}
				allowActions={decisionActionable}
			/>
		</div>
	)
}
