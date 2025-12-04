'use client'

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
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DeskCardDriverList } from './components/DeskCardDriverList'
import { DeskCardList } from './components/DeskCardList'
import { useSearchForm } from './Searching/useSearchForm'
import { deskColumns } from './table/DeskColumns'
import { deskDriverColumns } from './table/DeskDriverColumns'


export function DeskPage() {
	const { data, isLoading } = useGetLoadsBoard()
	const { data: dataOffers, isLoading: isLoadingOffers } = useGetIncomingOffers()

	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const { role } = useRoleStore()
	const tableType = useTableTypeStore((state) => state.tableType)
	const serverPaginationMeta = data?.results
		? {
			next: data.next,
			previous: data.previous,
			totalCount: data.count,
			pageSize: data.results.length,
		}
		: undefined

	const router = useRouter()

	useEffect(() => {
		if (role === RoleEnum.CARRIER) {
			router.push(DASHBOARD_URL.desk('my'))
		}
	}, [role, router])


	return (
		<div className='flex h-full flex-col md:gap-4'>
			<div className='w-full bg-background rounded-4xl max-md:mb-6 px-4 py-8 max-md:hidden'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<SearchFields form={form} showOffersFilter onSubmit={form.handleSubmit(onSubmit)} />
					</form>
				</Form>
			</div>

			{isDesktop ? (
				<Tabs defaultValue='desk' className='flex-1'>
					<div className='flex flex-wrap items-end gap-4'>
						<TabsList className='bg-transparent -mb-2'>
							<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='desk'>Заявки</TabsTrigger>
							<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='drivers'>Офферы для водителей</TabsTrigger>
						</TabsList>
						<div className='ml-auto'>
							<TableTypeSelector />
						</div>
					</div>
					<TabsContent value='desk' className='flex-1'>
						{isLoading ? <LoaderTable /> : data?.results?.length === 0 || !data?.results ? (
							<EmptyTableState />
						) : tableType === 'card' ? (
							<DeskCardList cargos={data.results} serverPagination={serverPaginationMeta} />
						) : (
							<DataTable
								columns={deskColumns}
								data={data.results}
								serverPagination={{
									next: data.next,
									previous: data.previous,
									totalCount: data.count,
								}}
							/>
						)}
					</TabsContent>
					<TabsContent value='drivers'>
						{isLoadingOffers ? <LoaderTable /> : dataOffers?.results?.length === 0 || !dataOffers?.results ? (
							<EmptyTableState />
						) : tableType === 'card' ? (
							<DeskCardDriverList cargos={dataOffers?.results || []} serverPagination={serverPaginationMeta} />
						) : (
							<DataTable
								columns={deskDriverColumns}
								data={dataOffers?.results || []}
								serverPagination={{
									next: dataOffers.next,
									previous: dataOffers.previous,
									totalCount: dataOffers.count,
								}}
							/>
						)}
					</TabsContent>
				</Tabs>
			) : (
				<Tabs defaultValue='desk' className='xs:bg-background rounded-4xl h-full'>
					<TabsList className='bg-transparent -mb-2'>
						<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='desk'>Заявки</TabsTrigger>
						<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='drivers'>Офферы для водителей</TabsTrigger>
					</TabsList>
					<TabsContent value='desk'>
						{isLoading ? <LoaderTable /> : data?.results?.length === 0 || !data?.results ? (
							<EmptyTableState />
						) :
							< DeskCardList cargos={data.results} serverPagination={serverPaginationMeta} />}
					</TabsContent>
					<TabsContent value='drivers'>
						{isLoading ? <LoaderTable /> : dataOffers?.results?.length === 0 || !dataOffers?.results ? (
							<EmptyTableState />
						) :
							< DeskCardDriverList cargos={dataOffers.results} serverPagination={serverPaginationMeta} />}
					</TabsContent>
				</Tabs>
			)
			}
		</div>
	)
}
