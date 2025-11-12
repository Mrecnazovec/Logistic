'use client'

import { Button } from '@/components/ui/Button'
import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { DASHBOARD_URL } from '@/config/url.config'
import { fakeCargoList } from '@/data/FakeData'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { Loader2, Search } from 'lucide-react'
import Link from 'next/link'
import { AnnouncementsCardList } from './components/AnnouncementsCardList'
import { useSearchForm } from './Searching/useSearchForm'
import { cargoColumns } from './table/CargoColumns'
import { ExpandedCargoRow } from './table/ExpandedCargoRow'

export function AnnouncementsPage() {
	const data = fakeCargoList
	const isLoading = false
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const tableType = useTableTypeStore((state) => state.tableType)

	const serverPaginationMeta = data?.results
		? {
			next: data.next,
			previous: data.previous,
			totalCount: data.count,
			pageSize: data.results.length,
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

			<div className='ml-auto md:flex hidden'><TableTypeSelector /></div>

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
						<h1 className='text-5xl font-bold'>Ничего не найдено...</h1>
						<p className='text-xl text-grayscale max-w-2xl text-center'>
							Мы не нашли объявлений по текущему запросу. Измените фильтры или создайте новое объявление.
						</p>
						<Link href={DASHBOARD_URL.posting()}>
							<Button className='w-[260px] h-[54px] text-base'>Создать объявление</Button>
						</Link>
					</div>
				</div>
			) : data?.results ? (
				isDesktop ? (
					tableType === 'card' ? (
						<AnnouncementsCardList cargos={data.results} serverPagination={serverPaginationMeta} />
					) : (
						<DataTable
							columns={cargoColumns}
							data={data.results}
							isButton
							serverPagination={{
								next: data.next,
								previous: data.previous,
								totalCount: data.count,
							}}
							renderExpandedRow={(row) => <ExpandedCargoRow cargo={row} />}
						/>
					)
				) : (
					<AnnouncementsCardList cargos={data.results} serverPagination={serverPaginationMeta} />
				)
			) : null}
		</div>
	)
}