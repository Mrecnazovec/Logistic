'use client'

import { Form } from "@/components/ui/form-control/Form"
import { SearchRatingFields } from "@/components/ui/search/SearchRatingFields"
import { TableTypeSelector } from "@/components/ui/selectors/TableTypeSelector"
import { DataTable } from "@/components/ui/table/DataTable"
import { EmptyTableState, LoaderTable } from "@/components/ui/table/TableStates"
import { useGetRatings } from "@/hooks/queries/ratings/useGet/useGetRatings"
import { DASHBOARD_URL } from "@/config/url.config"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useTableTypeStore } from "@/store/useTableTypeStore"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { RatingCardList } from "../../rating/components/RatingCardList"
import { useSearchForm } from "./Searching/useSearchForm"
import { ExpandedRatingRow } from "./table/ExpandedRatingRow"
import { ratingColumns } from "./table/RatingColumns"

export function RatingPage() {
	const router = useRouter()
	const param = useParams<{ role: string }>()
	const { ratings: data, isLoading } = useGetRatings()
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

	useEffect(() => {
		if (!param.role) router.push(DASHBOARD_URL.rating('customers'))
	}, [param.role, router])

	return (
		<div className="flex flex-col md:gap-4 h-full">
			<div className="w-full bg-background rounded-4xl max-md:mb-6 px-4 py-8">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<SearchRatingFields form={form} />
					</form>
				</Form>
			</div>
			<div className="items-end justify-end md:flex hidden">
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
						roleLabel={param.role ?? 'carriers'}
					/>
				) : (
					<DataTable
						columns={ratingColumns}
						data={results}
						isButton
						serverPagination={{
							next: data?.next,
							previous: data?.previous,
							totalCount: data?.count,
						}}
						renderExpandedRow={(row) => <ExpandedRatingRow user={row} />}
					/>
				)
			) : (
				<RatingCardList
					items={results}
					serverPagination={serverPaginationMeta}
					roleLabel={param.role ?? 'carriers'}
				/>
			)}
		</div>
	)
}
