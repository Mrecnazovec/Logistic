'use client'

import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { EmptyTableState, LoaderTable } from '@/components/ui/table/TableStates'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { useGetIncomingOffers } from '@/hooks/queries/offers/useGet/useGetIncomingOffers'
import { useGetMyOffers } from '@/hooks/queries/offers/useGet/useGetMyOffers'
import { useMediaQuery } from '@/hooks/useMediaQuery'
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

	return (
		<div className='flex h-full flex-col md:gap-4'>
			<div className='w-full bg-background rounded-4xl max-md:mb-6 px-4 py-8'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<SearchFields form={form} />
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
						{isLoading ? (
							<LoaderTable />
						) : deskResults.length === 0 ? (
							<EmptyTableState />
						) : tableType === 'card' ? (
							<DeskMyCardList cargos={deskResults} serverPagination={deskPagination} />
						) : (
							<DataTable
								columns={deskMyColumns}
								data={deskResults}
								serverPagination={{
									next: data?.next,
									previous: data?.previous,
									totalCount: data?.count,
								}}
							/>
						)}
					</TabsContent>
					<TabsContent value='drivers'>
						{isLoadingMy ? (
							<LoaderTable />
						) : myResults.length === 0 ? (
							<EmptyTableState />
						) : tableType === 'card' ? (
							<DeskDriverCardList cargos={myResults} serverPagination={myPagination} />
						) : (
							<DataTable
								columns={deskCarrierColumns}
								data={myResults}
								serverPagination={{
									next: dataMy?.next,
									previous: dataMy?.previous,
									totalCount: dataMy?.count,
								}}
							/>
						)}
					</TabsContent>
				</Tabs>
			) : (
				<Tabs defaultValue='desk' className='xs:bg-background'>
					<TabsList className='bg-transparent -mb-2'>
						<TabsTrigger
							className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none'
							value='desk'
						>
							Incoming offers
						</TabsTrigger>
						<TabsTrigger
							className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none'
							value='drivers'
						>
							My offers
						</TabsTrigger>
					</TabsList>
					<TabsContent value='desk'>
						{isLoading ? (
							<LoaderTable />
						) : deskResults.length === 0 ? (
							<EmptyTableState />
						) : (
							<DeskMyCardList cargos={deskResults} serverPagination={deskPagination} />
						)}
					</TabsContent>
					<TabsContent value='drivers'>
						{isLoadingMy ? (
							<LoaderTable />
						) : myResults.length === 0 ? (
							<EmptyTableState />
						) : (
							<DeskDriverCardList cargos={myResults} serverPagination={myPagination} />
						)}
					</TabsContent>
				</Tabs>
			)}
		</div>
	)
}
