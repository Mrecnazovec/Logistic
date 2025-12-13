"use client"

import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { EmptyTableState, LoaderTable } from '@/components/ui/table/TableStates'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { DASHBOARD_URL } from '@/config/url.config'
import { useGetLoadsBoard } from '@/hooks/queries/loads/useGet/useGetLoadsBoard'
import { useGetIncomingOffers } from '@/hooks/queries/offers/useGet/useGetIncomingOffers'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { useRoleStore } from '@/store/useRoleStore'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { DeskCardDriverList } from './components/DeskCardDriverList'
import { DeskCardList } from './components/DeskCardList'
import { useSearchForm } from './Searching/useSearchForm'
import { deskColumns, getDeskRowClassName } from './table/DeskColumns'
import { deskDriverColumns } from './table/DeskDriverColumns'

const tabs = [
	{ value: 'desk', label: 'Заявки' },
	{ value: 'drivers', label: 'Офферы для водителей' },
]

export function DeskPage() {
	const { data, isLoading } = useGetLoadsBoard()
	const { data: dataOffers, isLoading: isLoadingOffers } = useGetIncomingOffers()
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const { role } = useRoleStore()
	const tableType = useTableTypeStore((state) => state.tableType)
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	useEffect(() => {
		if (role === RoleEnum.CARRIER) router.push(DASHBOARD_URL.desk('my'))
	}, [role, router])

	const cargos = data?.results || []
	const offers = dataOffers?.results || []
	const serverPaginationMeta = cargos.length
		? {
			next: data?.next,
			previous: data?.previous,
			totalCount: data?.count,
			pageSize: cargos.length,
		}
		: undefined

	const renderDesk = () => {
		if (isLoading) return <LoaderTable />
		if (!cargos.length) return <EmptyTableState />
		return tableType === 'card' ? (
			<DeskCardList cargos={cargos} serverPagination={serverPaginationMeta} />
		) : (
			<DataTable
				columns={deskColumns}
				data={cargos}
				rowClassName={getDeskRowClassName}
				serverPagination={{ next: data?.next, previous: data?.previous, totalCount: data?.count }}
			/>
		)
	}

	const renderDrivers = () => {
		if (isLoadingOffers) return <LoaderTable />
		if (!offers.length) return <EmptyTableState />
		return tableType === 'card' ? (
			<DeskCardDriverList cargos={offers} serverPagination={serverPaginationMeta} />
		) : (
			<DataTable
				columns={deskDriverColumns}
				data={offers}
				serverPagination={{ next: dataOffers?.next, previous: dataOffers?.previous, totalCount: dataOffers?.count }}
			/>
		)
	}

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
				defaultValue='desk'
				className={isDesktop ? 'flex-1' : 'h-full rounded-4xl xs:bg-background'}
				onValueChange={handleTabChange}
			>
				<div className='flex flex-wrap items-end gap-4'>
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

				<TabsContent value='desk'>{isDesktop ? renderDesk() : <DeskCardList cargos={cargos} serverPagination={serverPaginationMeta} />}</TabsContent>
				<TabsContent value='drivers'>
					{isDesktop ? renderDrivers() : (
						isLoadingOffers ? <LoaderTable /> : offers.length ? (
							<DeskCardDriverList cargos={offers} serverPagination={serverPaginationMeta} />
						) : (
							<EmptyTableState />
						)
					)}
				</TabsContent>
			</Tabs>
		</div>
	)
}
