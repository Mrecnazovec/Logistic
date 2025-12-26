"use client"

import { Form } from '@/components/ui/form-control/Form'
import { SearchRatingFields } from '@/components/ui/search/SearchRatingFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { EmptyTableState, LoaderTable } from '@/components/ui/table/TableStates'
import { useGetRatings } from '@/hooks/queries/ratings/useGet/useGetRatings'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useI18n } from '@/i18n/I18nProvider'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { useMemo } from 'react'
import { RatingCardList } from './components/RatingCardList'
import { useSearchForm } from './Searching/useSearchForm'
import { ExpandedRatingRow } from './table/ExpandedRatingRow'
import { getRatingColumns } from './table/RatingColumns'

export function RatingPage() {
	const { ratings, isLoading } = useGetRatings()
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const tableType = useTableTypeStore((state) => state.tableType)
	const { t, locale } = useI18n()
	const columns = useMemo(() => getRatingColumns(t, locale), [t, locale])

	const results = ratings?.results ?? []

	const serverPaginationMeta = results.length
		? {
			next: ratings?.next,
			previous: ratings?.previous,
			totalCount: ratings?.count,
			pageSize: results.length,
		}
		: undefined

	return (
		<div className='flex flex-col md:gap-4 h-full'>
			<div className='w-full bg-background rounded-4xl max-md:mb-6 px-4 py-8 max-md:hidden'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<SearchRatingFields form={form} onSubmit={form.handleSubmit(onSubmit)} />
					</form>
				</Form>
			</div>
			<div className='items-end justify-end md:flex hidden'>
				<TableTypeSelector />
			</div>
			{isLoading ? (
				<LoaderTable />
			) : results.length === 0 ? (
				<EmptyTableState />
			) : isDesktop ? (
				tableType === 'card' ? (
					<RatingCardList
						items={results}
						serverPagination={serverPaginationMeta}
					/>
				) : (
					<DataTable
						columns={columns}
						data={results}
						isButton
						serverPagination={{
							next: ratings?.next,
							previous: ratings?.previous,
							totalCount: ratings?.count,
						}}
						renderExpandedRow={(row) => <ExpandedRatingRow user={row} />}
					/>
				)
			) : (
				<RatingCardList
					items={results}
					serverPagination={serverPaginationMeta}
				/>
			)}
		</div>
	)
}
