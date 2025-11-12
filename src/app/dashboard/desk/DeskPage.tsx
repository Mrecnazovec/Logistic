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
import { RoleEnum } from '@/shared/enums/Role.enum'
import { useRoleStore } from '@/store/useRoleStore'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { Loader2, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DeskCardList } from './components/DeskCardList'
import { useSearchForm } from './Searching/useSearchForm'
import { deskColumns } from './table/DeskColumns'


export function DeskPage() {
	const data = fakeCargoList
	const isLoading = false
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
						<h1 className='text-5xl font-bold'>Ничего не найдено</h1>
						<p className='text-xl text-grayscale max-w-2xl text-center'>
							Мы не нашли подходящих результатов, попробуйте изменить фильтры
						</p>
						<Link href={DASHBOARD_URL.posting()}>
							<Button className='w-[260px] h-[54px] text-base'>Создать заявку</Button>
						</Link>
					</div>
				</div>
			) : data?.results ? (
				isDesktop ? (
					<Tabs defaultValue='desk' className='flex-1'>
						<div className='flex flex-wrap items-end gap-4'>
							{role === RoleEnum.LOGISTIC && (
								<TabsList className='bg-transparent -mb-2'>
									<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='desk'>Заявки</TabsTrigger>
									<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='drivers'>Офферы для водителей</TabsTrigger>
								</TabsList>
							)}
							<div className='ml-auto'>
								<TableTypeSelector />
							</div>
						</div>
						<TabsContent value='desk' className='flex-1'>
							{tableType === 'card' ? (
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
							{tableType === 'card' ? (
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
					</Tabs>
				) : (
					<Tabs defaultValue='desk' className='bg-background'>
						<TabsList className='bg-transparent -mb-2'>
							<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='desk'>Заявки</TabsTrigger>
							<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='drivers'>Офферы для водителей</TabsTrigger>
						</TabsList>
						<TabsContent value='desk'>
							<DeskCardList cargos={data.results} serverPagination={serverPaginationMeta} />
						</TabsContent>
						<TabsContent value='drivers'>
							<DeskCardList cargos={data.results} serverPagination={serverPaginationMeta} />
						</TabsContent>
					</Tabs>
				)
			) : null}
		</div>
	)
}
