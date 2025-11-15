'use client'

import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { useGetIncomingOffers } from '@/hooks/queries/offers/useGet/useGetIncomingOffers'
import { useGetMyOffers } from '@/hooks/queries/offers/useGet/useGetMyOffers'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { Loader2, Search } from 'lucide-react'
import { useSearchForm } from '../Searching/useSearchForm'
import { DeskDriverCardList } from './components/DeskDriverCardList'
import { DeskMyCardList } from './components/DeskMyCardList'
import { deskCarrierColumns } from './table/DeskCarrierColumns'
import { deskMyColumns } from './table/DeskMyColumns'

const DeskEmptyState = () => (
	<div className='h-full bg-background rounded-4xl bg-[url(/png/bg_announcements.png)] bg-no-repeat bg-center bg-contain flex items-center justify-center'>
		<div className='flex items-center justify-center flex-col gap-6'>
			<div className='bg-background shadow-2xl p-4 rounded-full'>
				<Search className='size-5 text-brand' />
			</div>
			<h1 className='text-5xl font-bold'>Пусто</h1>
			<p className='text-xl text-grayscale max-w-2xl text-center'>
				Мы ничего не нашли
			</p>
		</div>
	</div>
)

export function DeskMyPage() {
	const { data, isLoading } = useGetIncomingOffers()
	const { data: dataMy, isLoading: isLoadingMy } = useGetMyOffers()
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const tableType = useTableTypeStore((state) => state.tableType)

	const deskResults = data?.results ?? []
	const myResults = dataMy?.results ?? []
	const isDeskEmpty = deskResults.length === 0

	return (
		<div className='flex h-full flex-col md:gap-4'>
			<div className='w-full bg-background rounded-4xl max-md:mb-6 px-4 py-8'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<SearchFields form={form} />
					</form>
				</Form>
			</div>

			{isLoading ? (
				<div className='flex-1 bg-background rounded-4xl flex items-center justify-center h-full'>
					<Loader2 className='size-10 animate-spin' />
				</div>
			) : isDesktop ? (
				<Tabs defaultValue='desk' className='flex-1'>
					<div className='flex items-end justify-between'>
						<TabsList className='bg-transparent -mb-2'>
							<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='desk'>
								Я предложил
							</TabsTrigger>
							<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='drivers'>
								Предложили мне
							</TabsTrigger>
						</TabsList>
						<TableTypeSelector />
					</div>
					<TabsContent value='desk' className='flex-1'>
						{isDeskEmpty ? (
							<DeskEmptyState />
						) : tableType === 'card' ? (
							<DeskMyCardList
								cargos={deskResults}
								serverPagination={{
									next: data?.next,
									previous: data?.previous,
									totalCount: data?.count,
									pageSize: deskResults.length,
								}}
							/>
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
							<div className='flex h-full items-center justify-center py-10'>
								<Loader2 className='size-6 animate-spin' />
							</div>
						) : tableType === 'card' ? (
							<DeskDriverCardList
								cargos={myResults}
								serverPagination={{
									next: dataMy?.next,
									previous: dataMy?.previous,
									totalCount: dataMy?.count,
									pageSize: myResults.length,
								}}
							/>
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
						<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='desk'>
							Я предложил
						</TabsTrigger>
						<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='drivers'>
							Предложили мне
						</TabsTrigger>
					</TabsList>
					<TabsContent value='desk'>
						{isDeskEmpty ? (
							<DeskEmptyState />
						) : (
							<DeskMyCardList
								cargos={deskResults}
								serverPagination={{
									next: data?.next,
									previous: data?.previous,
									totalCount: data?.count,
									pageSize: deskResults.length,
								}}
							/>
						)}
					</TabsContent>
					<TabsContent value='drivers'>
						{isLoadingMy ? (
							<div className='flex items-center justify-center py-10'>
								<Loader2 className='size-6 animate-spin' />
							</div>
						) : (
							<DeskDriverCardList
								cargos={myResults}
								serverPagination={{
									next: dataMy?.next,
									previous: dataMy?.previous,
									totalCount: dataMy?.count,
									pageSize: myResults.length,
								}}
							/>
						)}
					</TabsContent>
				</Tabs>
			)}
		</div>
	)
}
