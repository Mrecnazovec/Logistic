'use client'

import { Button } from '@/components/ui/Button'
import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { DASHBOARD_URL } from '@/config/url.config'
import { fakeCargoList } from '@/data/FakeData'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { Loader2, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { HistoryCardList } from './components/HistoryCardList'
import { useSearchForm } from './Searching/useSearchForm'
import { historyColumns } from './table/HistoryColumns'

export function HistoryPage() {
	const data = fakeCargoList
	const isLoading = false
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const router = useRouter()
	const tableType = useTableTypeStore((state) => state.tableType)

	const handleRowClick = useCallback(
		(cargo: ICargoList) => {
			router.push(DASHBOARD_URL.order(`${cargo.uuid}?status=finished`))
		},
		[router],
	)

	const serverPaginationMeta = data?.results
		? {
			next: data.next,
			previous: data.previous,
			totalCount: data.count,
			pageSize: data.results.length,
		}
		: undefined

	const renderEmptyState = () => (
		<div className='flex-1 bg-background rounded-4xl bg-[url(/png/bg_announcements.png)] bg-no-repeat bg-center bg-contain flex items-center justify-center'>
			<div className='flex items-center justify-center flex-col gap-6'>
				<div className='bg-background shadow-2xl p-4 rounded-full'>
					<Search className='size-5 text-brand' />
				</div>
				<h1 className='text-5xl font-bold'>Ничего не найдено...</h1>
				<p className='text-xl text-grayscale max-w-2xl text-center'>
					Мы не нашли завершённых заказов по текущему запросу. Попробуйте изменить фильтры или создайте новое объявление.
				</p>
				<Link href={DASHBOARD_URL.posting()}>
					<Button className='w-[260px] h-[54px] text-base'>Создать объявление</Button>
				</Link>
			</div>
		</div>
	)

	const renderDesktopContent = () => {
		if (isLoading) return <Loader />
		if (!data?.results?.length) return renderEmptyState()

		if (tableType === 'card') {
			return (
				<HistoryCardList
					cargos={data.results}
					serverPagination={serverPaginationMeta}
					onView={handleRowClick}
				/>
			)
		}

		return (
			<DataTable
				columns={historyColumns}
				data={data.results}
				isButton
				onRowClick={handleRowClick}
				serverPagination={serverPaginationMeta}
			/>
		)
	}

	const renderMobileContent = () => {
		if (isLoading) return <Loader />
		if (!data?.results?.length) return renderEmptyState()

		return (
			<HistoryCardList
				cargos={data.results}
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

function Loader() {
	return (
		<div className='flex-1 bg-background rounded-4xl flex items-center justify-center h-full'>
			<Loader2 className='size-10 animate-spin' />
		</div>
	)
}
