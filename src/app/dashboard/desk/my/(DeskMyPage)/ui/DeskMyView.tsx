"use client"

import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { EmptyTableState, LoaderTable } from '@/components/ui/table/TableStates'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { DeskMyCardList } from '../../components/DeskIncomeCardList'
import type { IOfferShort } from '@/shared/types/Offer.interface'
import { RoleEnum } from '@/shared/enums/Role.enum'

type DeskMyViewProps = {
	t: (...args: any[]) => string
	form: any
	onSubmit: (data: any) => void
	isDesktop: boolean
	tableType: 'table' | 'card'
	role?: RoleEnum
	tabs: Array<{ value: string; label: string }>
	hasUnreadDesk: boolean
	hasUnreadMy: boolean
	deskColumns: any
	incomeColumns: any
	deskResults: IOfferShort[]
	myResults: IOfferShort[]
	data: any
	dataMy: any
	isLoading: boolean
	isLoadingMy: boolean
	unreadOfferIds: Set<number>
	deskPagination?: any
	myPagination?: any
	handleOpenDecision: (offer: IOfferShort, options?: { forceFull?: boolean }) => void
	handleTabChange: (tab: string) => void
}

export function DeskMyView({
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
}: DeskMyViewProps) {
	const handleSearchSubmit = form.handleSubmit(onSubmit)

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

	return (
		<>
			<div className='w-full rounded-4xl bg-background px-4 py-8 max-md:mb-6 max-md:hidden'>
				<Form {...form}>
					<form onSubmit={handleSearchSubmit}>
						<SearchFields
							form={form}
							showOffersFilter
							showWeightRadiusFields={false}
							uuidPlaceholder={t('components.search.uuidPlaceholder.offer')}
							onSubmit={handleSearchSubmit}
						/>
					</form>
				</Form>
			</div>

			<Tabs defaultValue='drivers' className={isDesktop ? 'flex-1' : 'h-full rounded-4xl xs:bg-background'} onValueChange={handleTabChange}>
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
							)
						})}
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
		</>
	)
}
