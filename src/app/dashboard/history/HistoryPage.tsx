'use client'

import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { EmptyTableState, LoaderTable } from '@/components/ui/table/TableStates'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { DASHBOARD_URL } from '@/config/url.config'
import { useGetOrders } from '@/hooks/queries/orders/useGet/useGetOrders'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useI18n } from '@/i18n/I18nProvider'
import type { IOrderList } from '@/shared/types/Order.interface'
import { useRoleStore } from '@/store/useRoleStore'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { HistoryCardList } from './components/HistoryCardList'
import { useSearchForm } from './Searching/useSearchForm'
import { getHistoryColumns } from './table/HistoryColumns'
import { useTransportationStatusCounts } from '../transportation/hooks/useTransportationStatusCounts'

export function HistoryPage() {
	const { data, isLoading } = useGetOrders('paid')
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const tableType = useTableTypeStore((state) => state.tableType)
	const role = useRoleStore((state) => state.role)
	const { t } = useI18n()
	const columns = useMemo(() => getHistoryColumns(t, role), [role, t])
	const statusTabs = useMemo(
		() => [
			{ value: 'paid', label: t('history.tabs.paid') },
			{ value: 'canceled', label: t('history.tabs.canceled') },
		],
		[t],
	)
	const statusFromQuery = searchParams.get('status')
	const status =
		statusFromQuery && statusTabs.some((tab) => tab.value === statusFromQuery) ? statusFromQuery : 'paid'
	const { statusCounts } = useTransportationStatusCounts(statusTabs, searchParams)

	const handleRowClick = useCallback(
		(order: IOrderList) => {
			router.push(DASHBOARD_URL.order(`${order.id}`))
		},
		[router],
	)

	const handleStatusChange = (nextStatus: string) => {
		if (nextStatus === status) return
		const params = new URLSearchParams(searchParams.toString())
		params.set('status', nextStatus)
		params.delete('page')
		router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname)
	}

	const results = data?.results ?? []

	const serverPaginationMeta = results.length
		? {
			next: data?.next,
			previous: data?.previous,
			totalCount: data?.count,
			pageSize: results.length,
		}
		: undefined

	const renderDesktopContent = () => {
		if (isLoading) return <LoaderTable />
		if (!results.length) return <EmptyTableState />

		if (tableType === 'card') {
			return (
				<HistoryCardList
					orders={results}
					serverPagination={serverPaginationMeta}
					onView={handleRowClick}
				/>
			)
		}

		return (
			<DataTable
				columns={columns}
				data={results}
				isButton
				onRowClick={handleRowClick}
				serverPagination={serverPaginationMeta}
			/>
		)
	}

	const renderMobileContent = () => {
		if (isLoading) return <LoaderTable />
		if (!results.length) return <EmptyTableState />

		return (
			<HistoryCardList
				orders={results}
				serverPagination={serverPaginationMeta}
				onView={handleRowClick}
			/>
		)
	}

	return (
		<div className='flex flex-col md:gap-4 h-full'>
			<div className='w-full bg-background rounded-4xl max-md:mb-6 px-4 py-8 max-md:hidden'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<SearchFields
							form={form}
							showWeightRadiusFields={false}
							uuidPlaceholder={t('components.search.uuidPlaceholder.shipment')}
							onSubmit={form.handleSubmit(onSubmit)}
						/>
					</form>
				</Form>
			</div>

			{isDesktop ? (
				<Tabs className='h-full' value={status} onValueChange={handleStatusChange}>
					<div className='flex flex-wrap items-end gap-4'>
						<TabsList className='-mb-2 bg-transparent overflow-x-auto'>
							{statusTabs.map((tab) => (
								<TabsTrigger
									key={tab.value}
									className='rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none'
									value={tab.value}
								>
									<span className='inline-flex items-center gap-2'>
										<span>{tab.label}</span>
										{typeof statusCounts[tab.value] === 'number' ? <span>({statusCounts[tab.value]})</span> : null}
									</span>
								</TabsTrigger>
							))}
						</TabsList>
						<div className='ml-auto'>
							<TableTypeSelector />
						</div>
					</div>

					{statusTabs.map((tab) => (
						<TabsContent key={tab.value} value={tab.value} className='flex-1'>
							{renderDesktopContent()}
						</TabsContent>
					))}
				</Tabs>
			) : (
				<Tabs value={status} onValueChange={handleStatusChange} className='h-full rounded-4xl xs:bg-background'>
					<TabsList className='-mb-2 w-full justify-start overflow-x-scroll bg-transparent'>
						{statusTabs.map((tab) => (
							<TabsTrigger
								key={tab.value}
								className='rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none'
								value={tab.value}
							>
								<span className='inline-flex items-center gap-2'>
									<span>{tab.label}</span>
									{typeof statusCounts[tab.value] === 'number' ? <span>({statusCounts[tab.value]})</span> : null}
								</span>
							</TabsTrigger>
						))}
					</TabsList>

					{statusTabs.map((tab) => (
						<TabsContent key={tab.value} value={tab.value} className='flex-1'>
							{renderMobileContent()}
						</TabsContent>
					))}
				</Tabs>
			)}
		</div>
	)
}
