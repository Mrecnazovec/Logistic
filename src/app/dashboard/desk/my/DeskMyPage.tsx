"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
import { RoleEnum } from '@/shared/enums/Role.enum'
import type { IOfferShort } from '@/shared/types/Offer.interface'
import { useRoleStore } from '@/store/useRoleStore'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import dynamic from 'next/dynamic'
import { usePathname, useSearchParams } from 'next/navigation'
import { useSearchForm } from './Searching/useSearchForm'
import { DeskMyCardList } from './components/DeskIncomeCardList'
import { deskIncomeColumns } from './table/DeskIncomeColumns'
import { deskMyColumns } from './table/DeskMyColumns'

const OfferDecisionModal = dynamic(() => import('@/components/ui/modals/OfferDecisionModal').then((mod) => mod.OfferDecisionModal))

function useDecisionModal(role?: RoleEnum) {
	const [selectedOffer, setSelectedOffer] = useState<IOfferShort | undefined>()
	const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)
	const [decisionNote, setDecisionNote] = useState<string | undefined>()
	const [decisionActionable, setDecisionActionable] = useState(false)

	const openDecisionModal = (offer: IOfferShort) => {
		const meta = getOfferStatusMeta(offer, role)
		setSelectedOffer(offer)
		setDecisionNote(meta.note)
		setDecisionActionable(Boolean(meta.requireDecision))
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
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const {
		selectedOffer,
		isDecisionModalOpen,
		decisionNote,
		decisionActionable,
		openDecisionModal,
		closeDecisionModal,
	} = useDecisionModal(role ?? undefined)

	const tabs =
		role === RoleEnum.LOGISTIC
			? [
				{ value: 'drivers', label: 'Я предложил' },
				{ value: 'desk', label: 'Предложили мне' },
			]
			: [
				{ value: 'drivers', label: 'Предложили мне' },
				{ value: 'desk', label: 'Я предложил' },
			]

	const deskResults = data?.results ?? []
	const myResults = dataMy?.results ?? []

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
		<DeskMyCardList cargos={myResults} serverPagination={deskPagination} onOpenDecision={openDecisionModal} role={role} />
	) : (
		<DataTable
			columns={deskMyColumns}
			data={myResults}
			serverPagination={{ next: dataMy?.next, previous: dataMy?.previous, totalCount: dataMy?.count }}
			onRowClick={openDecisionModal}
		/>
	)

	const incomingDesktopContent = isLoading ? (
		<LoaderTable />
	) : !deskResults.length ? (
		<EmptyTableState />
	) : tableType === 'card' ? (
		<DeskMyCardList cargos={deskResults} serverPagination={myPagination} onOpenDecision={openDecisionModal} role={role} />
	) : (
		<DataTable
			columns={deskIncomeColumns}
			data={deskResults}
			serverPagination={{ next: data?.next, previous: data?.previous, totalCount: data?.count }}
			onRowClick={openDecisionModal}
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
						<SearchFields form={form} showOffersFilter onSubmit={form.handleSubmit(onSubmit)} />
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
						{tabs.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className='rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none'
							>
								{tab.label}
							</TabsTrigger>
						))}
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
						<DeskMyCardList cargos={myResults} serverPagination={deskPagination} onOpenDecision={openDecisionModal} role={role} />
					)}
				</TabsContent>
				<TabsContent value='drivers'>
					{isDesktop ? (
						incomingDesktopContent
					) : isLoading ? (
						<LoaderTable />
					) : deskResults.length ? (
						<DeskMyCardList cargos={deskResults} serverPagination={myPagination} onOpenDecision={openDecisionModal} role={role} />
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
