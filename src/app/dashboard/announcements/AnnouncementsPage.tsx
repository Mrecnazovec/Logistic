'use client'

import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { EmptyTableState, LoaderTable } from '@/components/ui/table/TableStates'
import { useGetLoadsPublic } from '@/hooks/queries/loads/useGet/useGetLoadsPublic'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { AnnouncementsCardList } from './components/AnnouncementsCardList'
import { useSearchForm } from './Searching/useSearchForm'
import { cargoColumns } from './table/CargoColumns'
import { ExpandedCargoRow } from './table/ExpandedCargoRow'

export function AnnouncementsPage() {
	const { data, isLoading } = useGetLoadsPublic()
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const tableType = useTableTypeStore((state) => state.tableType)

	const results = data?.results ?? []

	const serverPaginationMeta = results.length
		? {
			next: data?.next,
			previous: data?.previous,
			totalCount: data?.count,
			pageSize: results.length,
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

			<div className='ml-auto md:flex hidden'>
				<TableTypeSelector />
			</div>

			{isLoading ? (
				<LoaderTable />
			) : results.length === 0 ? (
				<EmptyTableState />
			) : isDesktop ? (
				tableType === 'card' ? (
					<AnnouncementsCardList cargos={results} serverPagination={serverPaginationMeta} />
				) : (
					<DataTable
						columns={cargoColumns}
						data={results}
						isButton
						serverPagination={{
							next: data?.next,
							previous: data?.previous,
							totalCount: data?.count,
						}}
						renderExpandedRow={(row) => <ExpandedCargoRow cargo={row} />}
					/>
				)
			) : (
				<AnnouncementsCardList cargos={results} serverPagination={serverPaginationMeta} />
			)}
		</div>
	)
}
