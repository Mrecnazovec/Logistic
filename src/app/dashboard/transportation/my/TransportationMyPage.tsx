'use client'

import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { EmptyTableState, LoaderTable } from '@/components/ui/table/TableStates'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { DASHBOARD_URL } from '@/config/url.config'
import { fakeCargoList } from '@/data/FakeData'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { useRoleStore } from '@/store/useRoleStore'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useSearchForm } from './Searching/useSearchForm'
import { createTransportationColumns } from './table/TransportationColumns'
import { TransportationMyCardList } from './components/TransportationMyCardList'

const STATUS_TABS = [
	{ value: 'no_driver', label: 'Без водителя' },
	{ value: 'pending', label: 'В ожидании' },
	{ value: 'en_route', label: 'В пути' },
	{ value: 'delivered', label: 'Доставлен' },
] as const

export function TransportationMyPage() {
	const data = fakeCargoList
	const isLoading = false
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const status = searchParams.get('status') ?? 'no_driver'
	const tableType = useTableTypeStore((state) => state.tableType)
	const role = useRoleStore((state) => state.role)
	const tableColumns = useMemo(() => createTransportationColumns(role), [role])

	const results = data?.results ?? []

	const serverPaginationMeta = results.length
		? {
			next: data.next,
			previous: data.previous,
			totalCount: data.count,
			pageSize: results.length,
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

	const renderDesktopContent = (tabLabel: string) => {
		if (isLoading) return <LoaderTable />
		if (!results.length) return <EmptyTableState />

		if (tableType === 'card') {
			return (
				<TransportationMyCardList
					cargos={results}
					serverPagination={serverPaginationMeta}
					statusLabel={tabLabel}
				/>
			)
		}

		return (
			<DataTable
				columns={tableColumns}
				data={results}
				onRowClick={handleRowClick}
				serverPagination={serverPaginationMeta}
			/>
		)
	}

	const renderMobileContent = (tabLabel: string) => {
		if (isLoading) return <LoaderTable />
		if (!results.length) return <EmptyTableState />

		return (
			<TransportationMyCardList
				cargos={results}
				serverPagination={serverPaginationMeta}
				statusLabel={tabLabel}
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
						<TabsList className='bg-transparent -mb-2'>
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
							{renderDesktopContent(tab.label)}
						</TabsContent>
					))}
				</Tabs>
			) : (
				<Tabs value={status} onValueChange={handleStatusChange} className='xs:bg-background rounded-4xl p-4'>
					<TabsList className='bg-transparent -mb-2'>
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
							{renderMobileContent(tab.label)}
						</TabsContent>
					))}
				</Tabs>
			)}
		</div>
	)
}
