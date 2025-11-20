'use client'

import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { EmptyTableState, LoaderTable } from '@/components/ui/table/TableStates'
import { DASHBOARD_URL } from '@/config/url.config'
import { useGetOrders } from '@/hooks/queries/orders/useGet/useGetOrders'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { IOrderList } from '@/shared/types/Order.interface'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { HistoryCardList } from './components/HistoryCardList'
import { useSearchForm } from './Searching/useSearchForm'
import { historyColumns } from './table/HistoryColumns'

export function HistoryPage() {
	const { data, isLoading } = useGetOrders('delivered')
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const router = useRouter()
	const tableType = useTableTypeStore((state) => state.tableType)

	const handleRowClick = useCallback(
		(order: IOrderList) => {
			router.push(DASHBOARD_URL.order(`${order.id}`))
		},
		[router],
	)

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
				columns={historyColumns}
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
			<div className='w-full bg-background rounded-4xl max-md:mb-6 px-4 py-8'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<SearchFields form={form} />
					</form>
				</Form>
			</div>

			<div className='md:flex hidden justify-end'>
				<TableTypeSelector />
			</div>

			{isDesktop ? renderDesktopContent() : renderMobileContent()}
		</div>
	)
}
