'use client'

import { Button } from '@/components/ui/Button'
import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { DASHBOARD_URL } from '@/config/url.config'
import { fakeCargoList } from '@/data/FakeData'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { Loader2, Search } from 'lucide-react'
import Link from 'next/link'
import { useSearchForm } from '../Searching/useSearchForm'
import { DeskDriverCardList } from './components/DeskDriverCardList'
import { DeskMyCardList } from './components/DeskMyCardList'
import { deskCarrierColumns } from './table/DeskCarrierColumns'
import { deskMyColumns } from './table/DeskMyColumns'


export function DeskMyPage() {
	const data = fakeCargoList
	const isLoading = false
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const tableType = useTableTypeStore((state) => state.tableType)



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
			) : data?.results?.length === 0 ? (
				<div className='flex-1 bg-background rounded-4xl bg-[url(/png/bg_announcements.png)] bg-no-repeat bg-center bg-contain flex items-center justify-center'>

					<div className='flex items-center justify-center flex-col gap-6'>
						<div className='bg-background shadow-2xl p-4 rounded-full'>
							<Search className='size-5 text-brand' />
						</div>
						<h1 className='text-5xl font-bold'>Пусто...</h1>
						<p className='text-xl text-grayscale max-w-2xl text-center'>
							Чтобы увидеть раздел Поиск Грузоперевозок, сначала надо добавить их. Вы можете это сделать нажав на кнопку снизу
						</p>
						<Link href={DASHBOARD_URL.posting()}>
							<Button className='w-[260px] h-[54px] text-base'>Добавить</Button>
						</Link>
					</div>
				</div>
			) : data?.results ? (
				isDesktop ? (
					<Tabs defaultValue='desk' className='flex-1'>
						<div className='flex items-end justify-between'>
							<TabsList className='bg-transparent -mb-2'>
								<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='desk'>Я предложил</TabsTrigger>
								<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='drivers'>Предложили мне</TabsTrigger>
							</TabsList>
							<TableTypeSelector />
						</div>
						<TabsContent value='desk' className='flex-1'>
							{tableType === 'card' ? (
								<DeskMyCardList
									cargos={data.results}
									serverPagination={{
										next: data.next,
										previous: data.previous,
										totalCount: data.count,
										pageSize: data.results.length,
									}}
								/>
							) : (
								<DataTable
									columns={deskMyColumns}
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
							{tableType === 'card' ? (
								<DeskDriverCardList
									cargos={data.results}
									serverPagination={{
										next: data.next,
										previous: data.previous,
										totalCount: data.count,
										pageSize: data.results.length,
									}}
								/>
							) : (
								<DataTable
									columns={deskCarrierColumns}
									data={data.results}
									serverPagination={{
										next: data.next,
										previous: data.previous,
										totalCount: data.count,
									}}
								/>
							)}
						</TabsContent>
					</Tabs>
				) : (
					<Tabs defaultValue='desk' className='bg-background'>
						<TabsList className='bg-transparent -mb-2'>
							<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='desk'>Я предложил</TabsTrigger>
							<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='drivers'>Предложили мне</TabsTrigger>
						</TabsList>
						<TabsContent value='desk'>
							<DeskMyCardList
								cargos={data.results}
								serverPagination={{
									next: data.next,
									previous: data.previous,
									totalCount: data.count,
									pageSize: data.results.length,
								}}
							/>
						</TabsContent>
						<TabsContent value='drivers'>
							<DeskDriverCardList
								cargos={data.results}
								serverPagination={{
									next: data.next,
									previous: data.previous,
									totalCount: data.count,
									pageSize: data.results.length,
								}}
							/>
						</TabsContent>
					</Tabs>
				)
			) : null}
		</div>
	)
}
