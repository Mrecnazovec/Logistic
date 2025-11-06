'use client'

import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { DataTable } from '@/components/ui/table/DataTable'
import { MobileDataTable } from '@/components/ui/table/MobileDataTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { useGetLoadsPublic } from '@/hooks/queries/loads/useGet/useGetLoadsPublic'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Loader2, Search } from 'lucide-react'
import { Activity, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSearchForm } from './Searching/useSearchForm'
import { transportationColumns } from './table/TransportationColumns'
import { useGetOrders } from '@/hooks/queries/orders/useGet/useGetOrders'

const STATUS_TABS = [
	{
		value: 'no_driver',
		label: 'Без водителя',
	},
	{
		value: 'pending',
		label: 'В ожидании',
	},
	{
		value: 'en_route',
		label: 'В пути',
	},
	{
		value: 'delivered',
		label: 'Доставлен',
	},
] as const


export function TransportationPage() {
	const { data, isLoading } = useGetLoadsPublic()
	const { data: orders, isLoading: isLoadingOrders } = useGetOrders()
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const status = searchParams.get('status') ?? 'no_driver'

	const handleStatusChange = useCallback(
		(nextStatus: string) => {
			if (nextStatus === status) return

			const params = new URLSearchParams(searchParams.toString())
			params.set('status', nextStatus)

			const queryString = params.toString()
			const nextRoute = queryString ? `${pathname}?${queryString}` : pathname

			router.replace(nextRoute)
		},
		[pathname, router, searchParams, status],
	)

	const hasResults = Boolean(data?.results?.length)

	const renderLoader = () => (
		<div className='flex-1 bg-background rounded-4xl flex items-center justify-center h-full'>
			<Loader2 className='size-10 animate-spin' />
		</div>
	)

	const renderEmptyState = () => (
		<div className='flex-1 bg-background rounded-4xl bg-[url(/png/bg_announcements.png)] bg-no-repeat bg-center bg-contain flex items-center justify-center'>
			<div className='flex items-center justify-center flex-col gap-6'>
				<div className='bg-background shadow-2xl p-4 rounded-full'>
					<Search className='size-5 text-brand' />
				</div>
				<h1 className='text-5xl font-bold'>Пусто...</h1>
			</div>
		</div>
	)

	const renderDesktopTabContent = () => {
		if (isLoading) return renderLoader()
		if (!hasResults) return renderEmptyState()

		return (
			<DataTable columns={transportationColumns} data={data?.results ?? []} />
		)
	}

	const renderMobileTabContent = () => {
		if (isLoading) return renderLoader()
		if (!hasResults) return renderEmptyState()
		if (!data) return null

		return (
			<Activity>
				<MobileDataTable data={data} isActions={true} />
			</Activity>
		)
	}


	return (
		<div className='flex h-full flex-col gap-4'>
			<div className='w-full bg-background rounded-4xl px-4 py-8'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<SearchFields form={form} />
					</form>
				</Form>
			</div>
			{isDesktop ? (
				<Tabs className='h-full' value={status} onValueChange={handleStatusChange}>
					<TabsList className='bg-transparent -mb-2'>
						{STATUS_TABS.map((tab) => (
							<TabsTrigger
								key={tab.value}
								className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none'
								value={tab.value}
							>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
					{STATUS_TABS.map((tab) => (
						<TabsContent
							key={tab.value}
							value={tab.value}
							className='flex-1'
						>
							{renderDesktopTabContent()}
						</TabsContent>
					))}
				</Tabs>
			) : (
				<Tabs defaultValue='desk' className='bg-background'>
					<TabsList className='bg-transparent -mb-2'>
						{STATUS_TABS.map((tab) => (
							<TabsTrigger
								key={tab.value}
								className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none'
								value={tab.value}
							>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
					{STATUS_TABS.map((tab) => (
						<TabsContent
							key={tab.value}
							value={tab.value}
							className='flex-1'
						>
							{renderMobileTabContent()}
						</TabsContent>
					))}
				</Tabs>
			)}
		</div>
	)
}

