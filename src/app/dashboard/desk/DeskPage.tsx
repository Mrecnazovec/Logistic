"use client"

import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { EmptyTableState, LoaderTable } from '@/components/ui/table/TableStates'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { DASHBOARD_URL } from '@/config/url.config'
import { useGetLoadsBoard } from '@/hooks/queries/loads/useGet/useGetLoadsBoard'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { useRoleStore } from '@/store/useRoleStore'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { useI18n } from '@/i18n/I18nProvider'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { DeskCardList } from './components/DeskCardList'
import { useSearchForm } from './Searching/useSearchForm'
import { getDeskColumns, getDeskRowClassName } from './table/DeskColumns'

export function DeskPage() {
	const { data, isLoading } = useGetLoadsBoard()
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const { role } = useRoleStore()
	const tableType = useTableTypeStore((state) => state.tableType)
	const { t } = useI18n()
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const tabs = useMemo(() => [{ value: 'desk', label: t('desk.tabs.requests') }], [t])
	const columns = useMemo(() => getDeskColumns(t), [t])

	useEffect(() => {
		if (role === RoleEnum.CARRIER) router.push(DASHBOARD_URL.desk('my'))
	}, [role, router])

	const cargos = data?.results || []
	const hasCargos = cargos.length > 0
	const serverPaginationMeta = hasCargos
		? {
			next: data?.next,
			previous: data?.previous,
			totalCount: data?.count,
			pageSize: cargos.length,
		}
		: undefined

	const tablePagination = serverPaginationMeta
		? { next: serverPaginationMeta.next, previous: serverPaginationMeta.previous, totalCount: serverPaginationMeta.totalCount }
		: undefined
	const isCardView = tableType === 'card'

	const desktopContent = isLoading ? (
		<LoaderTable />
	) : !hasCargos ? (
		<EmptyTableState />
	) : isCardView ? (
		<DeskCardList cargos={cargos} serverPagination={serverPaginationMeta} />
	) : (
		<DataTable
			columns={columns}
			data={cargos}
			rowClassName={getDeskRowClassName}
			serverPagination={tablePagination}
		/>
	)

	const handleTabChange = (tab: string) => {
		const params = new URLSearchParams(searchParams.toString())
		params.delete('page')
		const query = params.toString()
		router.replace(query ? `${pathname}?${query}` : pathname)
	}

	return (
		<div className='flex h-full flex-col md:gap-4'>
			<div className='w-full rounded-4xl bg-background px-4 py-8 max-md:mb-6 max-md:hidden'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<SearchFields
							form={form}
							showOffersFilter
							showWeightRadiusFields={false}
							uuidPlaceholder='По id заявки'
							onSubmit={form.handleSubmit(onSubmit)}
						/>
					</form>
				</Form>
			</div>

			<Tabs
				defaultValue='desk'
				className={isDesktop ? 'flex-1' : 'h-full rounded-4xl xs:bg-background'}
				onValueChange={handleTabChange}
			>
				<div className='flex flex-wrap items-end gap-4'>
					<TabsList className='-mb-2 bg-transparent'>
						{tabs.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className='rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none'
							>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
					{isDesktop && (
						<div className='ml-auto'>
							<TableTypeSelector />
						</div>
					)}
				</div>

				<TabsContent value='desk'>
					{isDesktop ? desktopContent : <DeskCardList cargos={cargos} serverPagination={serverPaginationMeta} />}
				</TabsContent>
			</Tabs>
		</div>
	)
}
