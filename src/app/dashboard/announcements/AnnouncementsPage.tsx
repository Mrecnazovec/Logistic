'use client'

import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { EmptyTableState, LoaderTable } from '@/components/ui/table/TableStates'
import { useGetLoadsPublic } from '@/hooks/queries/loads/useGet/useGetLoadsPublic'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { useI18n } from '@/i18n/I18nProvider'
import { AnnouncementsCardList } from './components/AnnouncementsCardList'
import { useSearchForm } from './Searching/useSearchForm'
import { getCargoColumns } from './table/CargoColumns'
import { ExpandedCargoRow } from './table/ExpandedCargoRow'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

export function AnnouncementsPage() {
	const { t, locale } = useI18n()
	const { data, isLoading } = useGetLoadsPublic()
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const searchParams = useSearchParams()
	const showOriginRadius = searchParams.has('origin_radius_km')
	const showDestinationRadius = searchParams.has('dest_radius_km')
	const tableType = useTableTypeStore((state) => state.tableType)
	const columns = useMemo(
		() => getCargoColumns(t, locale, { showOriginRadius, showDestinationRadius }),
		[t, locale, showOriginRadius, showDestinationRadius]
	)


	const results = data?.results ?? []
	const hasResults = results.length > 0
	const isCardView = !isDesktop || tableType === 'card'

	const serverPaginationMeta = hasResults
		? {
			next: data?.next,
			previous: data?.previous,
			totalCount: data?.count,
			pageSize: results.length,
		}
		: undefined

	const tablePagination = serverPaginationMeta
		? {
			next: serverPaginationMeta.next,
			previous: serverPaginationMeta.previous,
			totalCount: serverPaginationMeta.totalCount,
		}
		: undefined

	const content = isLoading ? (
		<LoaderTable />
	) : !hasResults ? (
		<EmptyTableState />
	) : isCardView ? (
		<AnnouncementsCardList
			cargos={results}
			serverPagination={serverPaginationMeta}
			showOriginRadius={showOriginRadius}
			showDestinationRadius={showDestinationRadius}
		/>
	) : (
		<DataTable
			columns={columns}
			data={results}
			isButton
			serverPagination={tablePagination}
			renderExpandedRow={(row) => <ExpandedCargoRow cargo={row} />}
		/>
	)

	return (
		<div className='flex h-full flex-col md:gap-4'>
			<div className='w-full bg-background rounded-4xl max-md:mb-6 px-4 py-8 max-md:hidden'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<SearchFields
							form={form}
							uuidPlaceholder={t('components.search.uuidPlaceholder.request')}
							showOffersFilter={false}
							showAxlesVolumeFields
							onSubmit={form.handleSubmit(onSubmit)}
						/>
					</form>
				</Form>
			</div>

			<div className='ml-auto md:flex hidden'>
				<TableTypeSelector />
			</div>

			{content}
		</div>
	)
}
