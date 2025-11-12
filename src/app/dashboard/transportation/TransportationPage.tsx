'use client'

import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { DASHBOARD_URL } from '@/config/url.config'
import { fakeCargoList } from '@/data/FakeData'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { Loader2, Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { TransportationCardList } from './components/TransportationCardList'
import { useSearchForm } from './Searching/useSearchForm'
import { transportationColumns } from './table/TransportationColumns'

const STATUS_TABS = [
	{ value: 'no_driver', label: 'Без водителя' },
	{ value: 'pending', label: 'В ожидании' },
	{ value: 'en_route', label: 'В пути' },
	{ value: 'delivered', label: 'Доставлено' },
] as const

export function TransportationPage() {
	const data = fakeCargoList
	const isLoading = false
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const status = searchParams.get('status') ?? 'no_driver'
	const tableType = useTableTypeStore((state) => state.tableType)

	const serverPaginationMeta = data?.results
		? {
			next: data.next,
			previous: data.previous,
			totalCount: data.count,
			pageSize: data.results.length,
		}
		: undefined

	const handleStatusChange = useCallback(
		(nextStatus: string) => {
			if (nextStatus === status) return

			const params = new URLSearchParams(searchParams.toString())
			params.set('status', nextStatus)

			const queryString = params.toString()
			const nextRoute = queryString ? `${pathname}?${queryString}` : pathname

			router.replace(nextRoute)
		},
		[pathname, router, searchParams, status],
	)

	const handleRowClick = useCallback(
		(cargo: ICargoList) => {
			router.push(DASHBOARD_URL.order(`${cargo.uuid}`))
		},
		[router],
	)

	const hasResults = Boolean(data?.results?.length)

	const renderLoader = () => (
		<div className='bg-background rounded-4xl flex items-center justify-center h-full'>
			<Loader2 className='size-10 animate-spin' />
		</div>
	)

	const renderEmptyState = () => (
		<div className='h-full bg-background rounded-4xl bg-[url(/png/bg_announcements.png)] bg-no-repeat bg-center bg-contain flex items-center justify-center'>
			<div className='flex items-center justify-center flex-col gap-6'>
				<div className='bg-background shadow-2xl p-4 rounded-full'>
					<Search className='size-5 text-brand' />
				</div>
				<h1 className='text-5xl font-bold'>Ничего не найдено...</h1>
			</div>
		</div>
	)

	const renderDesktopContent = (tabValue: string) => {
		if (isLoading) return renderLoader()
		if (!hasResults || !data?.results?.length) return renderEmptyState()

		if (tableType === 'card') {
			return (
				<TransportationCardList
					cargos={data.results}
					serverPagination={serverPaginationMeta}
					statusValue={tabValue}
				/>
			)
		}

		return (
			<DataTable
				columns={transportationColumns}
				data={data.results}
				onRowClick={handleRowClick}
				serverPagination={serverPaginationMeta}
			/>
		)
	}

	const renderMobileContent = (tabValue: string) => {
		if (isLoading) return renderLoader()
		if (!hasResults || !data?.results?.length) return renderEmptyState()

		return (
			<TransportationCardList
				cargos={data.results}
				serverPagination={serverPaginationMeta}
				statusValue={tabValue}
			/>
		)
	}

	return (
		<div className='flex h-full flex-col gap-4'>
			<div className='w-full bg-background rounded-4xl px-4 py-8'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<SearchFields form={form} />
					</form>
				</Form>
			</div>

			{isDesktop ? (
				<Tabs className='h-full' value={status} onValueChange={handleStatusChange}>
					<div className='flex flex-wrap items-end gap-4'>
						<TabsList className='bg-transparent -mb-2 '>
							{STATUS_TABS.map((tab) => (
								<TabsTrigger
									key={tab.value}
									className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none'
									value={tab.value}
								>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
						<div className='ml-auto'>
							<TableTypeSelector />
						</div>
					</div>

					{STATUS_TABS.map((tab) => (
						<TabsContent key={tab.value} value={tab.value} className='flex-1'>
							{renderDesktopContent(tab.value)}
						</TabsContent>
					))}
				</Tabs>
			) : (
				<Tabs value={status} onValueChange={handleStatusChange} className='xs:bg-background rounded-4xl p-4'>
					<TabsList className='bg-transparent -mb-2 w-full overflow-x-scroll justify-start'>
						{STATUS_TABS.map((tab) => (
							<TabsTrigger
								key={tab.value}
								className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none'
								value={tab.value}
							>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>

					{STATUS_TABS.map((tab) => (
						<TabsContent key={tab.value} value={tab.value} className='flex-1'>
							{renderMobileContent(tab.value)}
						</TabsContent>
					))}
				</Tabs>
			)}
		</div>
	)
}