'use client'

import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { EmptyTableState, LoaderTable } from '@/components/ui/table/TableStates'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { DASHBOARD_URL } from '@/config/url.config'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { IOrderList } from '@/shared/types/Order.interface'
import { useRoleStore } from '@/store/useRoleStore'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSearchForm } from './Searching/useSearchForm'
import { useGetOrders } from '@/hooks/queries/orders/useGet/useGetOrders'
import { createTransportationColumns } from '../table/TransportationColumns'
import { TransportationCardList } from '../components/TransportationCardList'
import { useTransportationStatusCounts } from '../hooks/useTransportationStatusCounts'

const STATUS_TABS = [
	{ value: 'no_driver', label: 'Без водителя' },
	{ value: 'pending', label: 'В ожидании' },
	{ value: 'in_process', label: 'В процессе' },
	{ value: 'delivered', label: 'Доставлен' },
	{ value: 'paid', label: 'Оплачен' },
] as const

const normalizeOrders = (orders: IOrderList[] = []): IOrderList[] =>
	orders.map((order) => ({
		...order,
		roles: {
			customer: {
				id: (order as any).customer_id ?? 0,
				name: order.customer_name ?? '',
				login: '',
				phone: (order as any).customer_phone ?? '',
				company: order.customer_company ?? '',
				role: RoleEnum.CUSTOMER,
			},
			logistic: (order as any).logistic_id
				? {
						id: (order as any).logistic_id,
						name: order.logistic_name ?? '',
						login: '',
						phone: (order as any).logistic_phone ?? '',
						company: order.logistic_company ?? '',
						role: RoleEnum.LOGISTIC,
				  }
				: null,
			carrier: (order as any).carrier_id
				? {
						id: (order as any).carrier_id,
						name: order.carrier_name ?? '',
						login: '',
						phone: (order as any).carrier_phone ?? '',
						company: order.carrier_company ?? '',
						role: RoleEnum.CARRIER,
				  }
				: null,
		},
	}))

export function TransportationMyPage() {
	const { data, isLoading } = useGetOrders()

	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const status = searchParams.get('status') ?? 'no_driver'
	const tableType = useTableTypeStore((state) => state.tableType)
	const role = useRoleStore((state) => state.role)
	const tableColumns = createTransportationColumns(role)
	const results = normalizeOrders(data?.results ?? [])
	const { statusCounts } = useTransportationStatusCounts(STATUS_TABS, searchParams)

	const serverPaginationMeta = results.length
		? {
			next: data?.next,
			previous: data?.previous,
			totalCount: data?.count,
			pageSize: results.length,
		}
		: undefined

	const ordersContent = isLoading ? (
		<LoaderTable />
	) : !results.length ? (
		<EmptyTableState />
	) : !isDesktop || tableType === 'card' ? (
		<TransportationCardList cargos={results} serverPagination={serverPaginationMeta} statusValue={status} />
	) : (
		<DataTable
			columns={tableColumns}
			data={results}
			onRowClick={(order: IOrderList) => router.push(DASHBOARD_URL.order(`${order.id}`))}
			getRowHref={(order: IOrderList) => DASHBOARD_URL.order(`${order.id}`)}
			prefetchOnRowHover
			serverPagination={serverPaginationMeta}
		/>
	)

	return (
		<div className='flex h-full flex-col gap-4'>
			<div className='w-full bg-background rounded-4xl max-md:mb-6 px-4 py-8 max-md:hidden'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<SearchFields form={form} onSubmit={form.handleSubmit(onSubmit)} />
					</form>
				</Form>
			</div>

			{isDesktop ? (
				<Tabs
					className='h-full'
					value={status}
					onValueChange={(nextStatus) => {
						if (nextStatus === status) return
						const params = new URLSearchParams(searchParams.toString())
						params.set('status', nextStatus)
						const queryString = params.toString()
						const nextRoute = queryString ? `${pathname}?${queryString}` : pathname
						router.replace(nextRoute)
					}}
				>
					<div className='flex flex-wrap items-end gap-4'>
						<TabsList className='bg-transparent -mb-2'>
							{STATUS_TABS.map((tab) => (
								<TabsTrigger
									key={tab.value}
									className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none'
									value={tab.value}
								>
									<span className='inline-flex items-center gap-2'>
										<span>{tab.label}</span>
										{typeof statusCounts[tab.value] === 'number' ? (
											<span className='rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground'>{statusCounts[tab.value]}</span>
										) : null}
									</span>
								</TabsTrigger>
							))}
						</TabsList>
						<div className='ml-auto'>
							<TableTypeSelector />
						</div>
					</div>

					{STATUS_TABS.map((tab) => (
						<TabsContent key={tab.value} value={tab.value} className='flex-1'>
							{ordersContent}
						</TabsContent>
					))}
				</Tabs>
			) : (
				<Tabs
					value={status}
					onValueChange={(nextStatus) => {
						if (nextStatus === status) return
						const params = new URLSearchParams(searchParams.toString())
						params.set('status', nextStatus)
						const queryString = params.toString()
						const nextRoute = queryString ? `${pathname}?${queryString}` : pathname
						router.replace(nextRoute)
					}}
					className='xs:bg-background rounded-4xl p-4'
				>
					<TabsList className='bg-transparent -mb-2'>
						{STATUS_TABS.map((tab) => (
							<TabsTrigger
								key={tab.value}
								className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none'
								value={tab.value}
							>
								<span className='inline-flex items-center gap-2'>
									<span>{tab.label}</span>
									{typeof statusCounts[tab.value] === 'number' ? (
										<span className='rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground'>{statusCounts[tab.value]}</span>
									) : null}
								</span>
							</TabsTrigger>
						))}
					</TabsList>

					{STATUS_TABS.map((tab) => (
						<TabsContent key={tab.value} value={tab.value} className='flex-1'>
							{ordersContent}
						</TabsContent>
					))}
				</Tabs>
			)}
		</div>
	)
}
