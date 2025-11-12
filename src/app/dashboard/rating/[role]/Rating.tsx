'use client'

import { Button } from "@/components/ui/Button"
import { Form } from "@/components/ui/form-control/Form"
import { SearchRatingFields } from "@/components/ui/search/SearchRatingFields"
import { TableTypeSelector } from "@/components/ui/selectors/TableTypeSelector"
import { DataTable } from "@/components/ui/table/DataTable"
import { DASHBOARD_URL } from "@/config/url.config"
import { fakeRatingsList } from "@/data/FakeData"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useTableTypeStore } from "@/store/useTableTypeStore"
import { Loader2, Search } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { RatingCardList } from "../../rating/components/RatingCardList"
import { useSearchForm } from "./Searching/useSearchForm"
import { ExpandedRatingRow } from "./table/ExpandedRatingRow"
import { ratingColumns } from "./table/RatingColumns"

export function Rating() {
	const router = useRouter()
	const param = useParams<{ role: string }>()
	const data = fakeRatingsList
	const isLoading = false
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const tableType = useTableTypeStore((state) => state.tableType)



	useEffect(() => {
		if (!param.role) router.push(DASHBOARD_URL.rating('customers'))
	}, [param.role, router])

	return <div className="flex flex-col md:gap-4 h-full">
		<div className="w-full bg-background rounded-4xl max-md:mb-6 px-4 py-8"><Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<SearchRatingFields form={form} />
			</form>
		</Form></div>
		<div className="items-end justify-end md:flex hidden">
			<TableTypeSelector />
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
				tableType === 'card' ? (
					<RatingCardList
						items={data.results}
						serverPagination={{
							next: data.next,
							previous: data.previous,
							totalCount: data.count,
							pageSize: data.results.length,
						}}
						roleLabel={param.role ?? 'carriers'}
					/>
				) : (
					<DataTable
						columns={ratingColumns}
						data={data.results}
						isButton
						serverPagination={{
							next: data.next,
							previous: data.previous,
							totalCount: data.count,
						}}
						renderExpandedRow={(row) => <ExpandedRatingRow user={row} />}

					/>
				)
			) : (
				<RatingCardList
					items={data.results}
					serverPagination={{
						next: data.next,
						previous: data.previous,
						totalCount: data.count,
						pageSize: data.results.length,
					}}
					roleLabel={param.role ?? 'carriers'}
				/>
			)
		) : null}
	</div>
}
