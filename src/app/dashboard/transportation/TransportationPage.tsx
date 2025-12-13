"use client"

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { TableTypeSelector } from '@/components/ui/selectors/TableTypeSelector'
import { DataTable } from '@/components/ui/table/DataTable'
import { EmptyTableState, LoaderTable } from '@/components/ui/table/TableStates'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { DASHBOARD_URL } from '@/config/url.config'
import { useGetAgreements } from '@/hooks/queries/agreements/useGetAgreements'
import { useGetOrders } from '@/hooks/queries/orders/useGet/useGetOrders'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { IAgreement } from '@/shared/types/Agreement.interface'
import { IOrderList } from '@/shared/types/Order.interface'
import { useRoleStore } from '@/store/useRoleStore'
import { useTableTypeStore } from '@/store/useTableTypeStore'
import { AgreementsCardList } from './components/AgreementsCardList'
import { TransportationCardList } from './components/TransportationCardList'
import { useTransportationStatusCounts } from './hooks/useTransportationStatusCounts'
import { useSearchForm } from './Searching/useSearchForm'
import { createAgreementColumns } from './table/AgreementColumns'
import { createTransportationColumns } from './table/TransportationColumns'

const AGREEMENTS_TAB = { value: 'agreements', label: 'Соглашения' } as const

const STATUS_TABS = [
    { value: 'no_driver', label: 'Без водителя' },
    { value: 'pending', label: 'В ожидании' },
    { value: 'in_process', label: 'В процессе' },
    { value: 'delivered', label: 'Доставлен' },
    { value: 'paid', label: 'Оплачен' },
] as const

export function TransportationPage() {
    const { data: agreementsData, isLoading: isLoadingAgreements } = useGetAgreements()
    const { data, isLoading } = useGetOrders()
    const { form, onSubmit } = useSearchForm()
    const isDesktop = useMediaQuery('(min-width: 768px)')
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const status = searchParams.get('status') ?? 'agreements'
    const tableType = useTableTypeStore((state) => state.tableType)
    const role = useRoleStore((state) => state.role)
    const tableColumns = useMemo(() => createTransportationColumns(role), [role])
    const agreementColumns = useMemo(() => createAgreementColumns(), [])

    const agreements = agreementsData?.results ?? []
    const orders = data?.results ?? []
    const { statusCounts } = useTransportationStatusCounts(STATUS_TABS, searchParams)
    const agreementsCount = agreementsData?.count

    const serverPaginationMeta = orders.length
        ? { next: data?.next, previous: data?.previous, totalCount: data?.count, pageSize: orders.length }
        : undefined

    const agreementPaginationMeta = agreements.length
        ? { next: agreementsData?.next, previous: agreementsData?.previous, totalCount: agreementsData?.count, pageSize: agreements.length }
        : undefined

    const handleStatusChange = (nextStatus: string) => {
        if (nextStatus === status) return
        const params = new URLSearchParams(searchParams.toString())
        params.set('status', nextStatus)
        params.delete('page')
        router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname)
    }

    const handleOrderRowClick = (order: IOrderList) => {
        router.push(DASHBOARD_URL.order(`${order.id}`))
    }

    const handleAgreementRowClick = (agreement: IAgreement) => {
        router.push(`/dashboard/order/agreement/${agreement.id}`)
    }

    const renderTabLabel = (tabValue: (typeof STATUS_TABS)[number] | typeof AGREEMENTS_TAB) => {
        if (tabValue.value === AGREEMENTS_TAB.value) {
            return (
                <span className='inline-flex items-center gap-2'>
                    <span>{tabValue.label}</span>
                    {typeof agreementsCount === 'number' ? <span>({agreementsCount})</span> : null}
                </span>
            )
        }

        const count = statusCounts[tabValue.value]
        return (
            <span className='inline-flex items-center gap-2'>
                <span>{tabValue.label}</span>
                {typeof count === 'number' ? <span>({count})</span> : null}
            </span>
        )
    }

    const renderAgreementsContent = (forceCards = false) => {
        if (isLoadingAgreements) return <LoaderTable />
        if (!agreements.length) return <EmptyTableState />

        if (forceCards || tableType === 'card') {
            return <AgreementsCardList agreements={agreements} serverPagination={agreementPaginationMeta} />
        }

        return (
            <DataTable
                columns={agreementColumns}
                data={agreements}
                onRowClick={handleAgreementRowClick}
                serverPagination={agreementPaginationMeta}
            />
        )
    }

    const renderDesktopContent = (tabValue: string) => {
        if (tabValue === AGREEMENTS_TAB.value) return renderAgreementsContent()
        if (isLoading) return <LoaderTable />
        if (!orders.length) return <EmptyTableState />

        return tableType === 'card' ? (
            <TransportationCardList cargos={orders} serverPagination={serverPaginationMeta} statusValue={tabValue} />
        ) : (
            <DataTable columns={tableColumns} data={orders} onRowClick={handleOrderRowClick} serverPagination={serverPaginationMeta} />
        )
    }

    const renderMobileContent = (tabValue: string) => {
        if (tabValue === AGREEMENTS_TAB.value) return renderAgreementsContent(true)
        if (isLoading) return <LoaderTable />
        if (!orders.length) return <EmptyTableState />

        return <TransportationCardList cargos={orders} serverPagination={serverPaginationMeta} statusValue={tabValue} />
    }

    return (
        <div className='flex h-full flex-col gap-4'>
            <div className='w-full rounded-4xl bg-background px-4 py-8 max-md:mb-6 max-md:hidden'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <SearchFields form={form} onSubmit={form.handleSubmit(onSubmit)} />
                    </form>
                </Form>
            </div>

            {isDesktop ? (
                <Tabs className='h-full' value={status} onValueChange={handleStatusChange}>
                    <div className='flex flex-wrap items-end gap-4'>
                        <TabsList className='-mb-2 bg-transparent overflow-x-auto'>
                            {[AGREEMENTS_TAB, ...STATUS_TABS].map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    className='rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none'
                                    value={tab.value}
                                >
                                    {renderTabLabel(tab)}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <div className='ml-auto'>
                            <TableTypeSelector />
                        </div>
                    </div>

                    {[AGREEMENTS_TAB, ...STATUS_TABS].map((tab) => (
                        <TabsContent key={tab.value} value={tab.value} className='flex-1'>
                            {renderDesktopContent(tab.value)}
                        </TabsContent>
                    ))}
                </Tabs>
            ) : (
                <Tabs value={status} onValueChange={handleStatusChange} className='h-full rounded-4xl xs:bg-background'>
                    <TabsList className='-mb-2 w-full justify-start overflow-x-scroll bg-transparent'>
                        {[AGREEMENTS_TAB, ...STATUS_TABS].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                className='rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none'
                                value={tab.value}
                            >
                                {renderTabLabel(tab)}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {[AGREEMENTS_TAB, ...STATUS_TABS].map((tab) => (
                        <TabsContent key={tab.value} value={tab.value} className='flex-1'>
                            {renderMobileContent(tab.value)}
                        </TabsContent>
                    ))}
                </Tabs>
            )}
        </div>
    )
}
