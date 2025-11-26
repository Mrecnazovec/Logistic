'use client'

import { useState } from 'react'

import { Form } from '@/components/ui/form-control/Form'
import { OfferDecisionModal } from '@/components/ui/modals/OfferDecisionModal'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { EmptyTableState, LoaderTable } from '@/components/ui/table/TableStates'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { useGetIncomingOffers } from '@/hooks/queries/offers/useGet/useGetIncomingOffers'
import { useGetMyOffers } from '@/hooks/queries/offers/useGet/useGetMyOffers'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { IOfferShort } from '@/shared/types/Offer.interface'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { useSearchForm } from '../Searching/useSearchForm'
import { DeskDriverCardList } from './components/DeskDriverCardList'
import { DeskMyCardList } from './components/DeskMyCardList'
import { deskCarrierColumns } from './table/DeskCarrierColumns'
import { deskMyColumns } from './table/DeskMyColumns'


export function DeskMyPage() {
	const { data, isLoading } = useGetIncomingOffers()
	const { data: dataMy, isLoading: isLoadingMy } = useGetMyOffers()
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const tableType = useTableTypeStore((state) => state.tableType)

	const deskResults = data?.results ?? []
	const myResults = dataMy?.results ?? []

	const deskPagination = deskResults.length
		? {
			next: data?.next,
			previous: data?.previous,
			totalCount: data?.count,
			pageSize: deskResults.length,
		}
		: undefined

	const myPagination = myResults.length
		? {
			next: dataMy?.next,
			previous: dataMy?.previous,
			totalCount: dataMy?.count,
			pageSize: myResults.length,
		}
		: undefined

	const [selectedOffer, setSelectedOffer] = useState<IOfferShort | undefined>()
	const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)

	const handleRowClick = (offer: IOfferShort) => {
		const status = (offer.status_display || '').toLowerCase()
		if (status.includes('ожидает')) {
			setSelectedOffer(offer)
			setIsDecisionModalOpen(true)
		}
	}

	const handleModalOpenChange = (open: boolean) => {
		setIsDecisionModalOpen(open)
		if (!open) {
			setSelectedOffer(undefined)
		}
	}

	return (
		<div className='flex h-full flex-col md:gap-4'>
			<div className='w-full bg-background rounded-4xl max-md:mb-6 px-4 py-8'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<SearchFields form={form} showOffersFilter />
					</form>
				</Form>
			</div>

			{isDesktop ? (
				<Tabs defaultValue='desk' className='flex-1'>
					<div className='flex items-end justify-between'>
						<TabsList className='bg-transparent -mb-2'>
							<TabsTrigger
								className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none'
								value='desk'
							>
								Я предложил
							</TabsTrigger>
							<TabsTrigger
								className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none'
								value='drivers'
							>
								Предложили мне
							</TabsTrigger>
						</TabsList>
						<TableTypeSelector />
					</div>
					<TabsContent value='desk' className='flex-1'>
						{isLoadingMy ? (
							<LoaderTable />
						) : myResults.length === 0 ? (
							<EmptyTableState />
						) : tableType === 'card' ? (
							<DeskMyCardList cargos={myResults} serverPagination={deskPagination} />
						) : (
							<DataTable
								columns={deskCarrierColumns}
								data={myResults}
								serverPagination={{
									next: dataMy?.next,
									previous: dataMy?.previous,
									totalCount: dataMy?.count,
								}}
								onRowClick={handleRowClick}
							/>

						)}
					</TabsContent>
					<TabsContent value='drivers'>
						{isLoading ? (
							<LoaderTable />
						) : deskResults.length === 0 ? (
							<EmptyTableState />
						) : tableType === 'card' ? (
							<DeskDriverCardList cargos={deskResults} serverPagination={myPagination} />
						) : (
							<DataTable
								columns={deskMyColumns}
								data={deskResults}
								serverPagination={{
									next: data?.next,
									previous: data?.previous,
									totalCount: data?.count,
								}}
								onRowClick={handleRowClick}
							/>
						)}
					</TabsContent>
				</Tabs>
			) : (
				<Tabs defaultValue='desk' className='xs:bg-background h-full'>
					<TabsList className='bg-transparent -mb-2'>
						<TabsTrigger
							className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none'
							value='desk'
						>
							Я предложил
						</TabsTrigger>
						<TabsTrigger
							className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none'
							value='drivers'
						>
							Предложили мне
						</TabsTrigger>
					</TabsList>
					<TabsContent value='desk'>
						{isLoadingMy ? (
							<LoaderTable />
						) : myResults.length === 0 ? (
							<EmptyTableState />
						) : (
							<DeskMyCardList cargos={myResults} serverPagination={deskPagination} />
						)}
					</TabsContent>
					<TabsContent value='drivers'>
						{isLoading ? (
							<LoaderTable />
						) : deskResults.length === 0 ? (
							<EmptyTableState />
						) : (
							<DeskDriverCardList cargos={deskResults} serverPagination={myPagination} />
						)}
					</TabsContent>
				</Tabs>
			)}

			<OfferDecisionModal
				key={selectedOffer?.id ?? 'empty'}
				offer={selectedOffer}
				open={isDecisionModalOpen}
				onOpenChange={handleModalOpenChange}
			/>
		</div>
	)
}
