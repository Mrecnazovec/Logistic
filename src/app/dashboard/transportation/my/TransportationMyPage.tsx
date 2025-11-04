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

export function TransportationMyPage() {
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


	return (
		<div className='flex h-full flex-col gap-4'>
			<div className='w-full bg-background rounded-4xl px-4 py-8'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<SearchFields form={form} />
					</form>
				</Form>
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
					</div>
				</div>
			) : data?.results ? (
				isDesktop ? (
					<Tabs value={status} onValueChange={handleStatusChange}>
						<TabsList className='bg-transparent -mb-2'>
							<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='no_driver'>Без водителя</TabsTrigger>
							<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='pending'>В ожидании</TabsTrigger>
							<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='en_route'>В пути</TabsTrigger>
							<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='delivered'>Доставлен</TabsTrigger>
						</TabsList>
						<TabsContent value='no_driver'>
							<DataTable
								columns={transportationColumns}
								data={data.results}
							/>
						</TabsContent>
						<TabsContent value='pending'>
							<DataTable
								columns={transportationColumns}
								data={data.results}
							/>
						</TabsContent>
						<TabsContent value='en_route'>
							<DataTable
								columns={transportationColumns}
								data={data.results}
							/>
						</TabsContent>
						<TabsContent value='delivered'>
							<DataTable
								columns={transportationColumns}
								data={data.results}
							/>
						</TabsContent>
					</Tabs>
				) : (
					<Tabs defaultValue='desk' className='bg-background'>
						<TabsList className='bg-transparent -mb-2'>
							<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='desk'>Заявки</TabsTrigger>
							<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='drivers'>Офферы для водителей</TabsTrigger>
						</TabsList>
						<TabsContent value='desk'>
							<Activity>
								<MobileDataTable data={data} isActions={true} />
							</Activity>
						</TabsContent>
						<TabsContent value='drivers'>
							<Activity>
								<MobileDataTable data={data} isActions={true} />
							</Activity>
						</TabsContent>
					</Tabs>
				)
			) : null}
		</div>
	)
}
