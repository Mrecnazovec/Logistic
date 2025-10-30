'use client'

import { Button } from '@/components/ui/Button'
import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { DASHBOARD_URL } from '@/config/url.config'
import { Loader2, Search } from 'lucide-react'
import Link from 'next/link'
// import { fakeCargoList } from '@/data/FakeData'
import { NavInitializer } from '@/components/layouts/dashboard-layout/NavInitializer'
import { DataTable } from '@/components/ui/table/DataTable'
import { MobileDataTable } from '@/components/ui/table/MobileDataTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useGetLoadsPublic } from '@/hooks/queries/loads/useGet/useGetLoadsPublic'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Activity } from 'react'
import { useSearchForm } from '../Searching/useSearchForm'
import { deskCarrierColumns } from './table/DeskCarrierColumns'
import { deskMyColumns } from './table/DeskMyColumns'
import { useGetMyOffers } from '@/hooks/queries/offers/useGet/useGetMyOffers'
import { useGetIncomingOffers } from '@/hooks/queries/offers/useGet/useGetIncomingOffers'


export function DeskMyPage() {
	const { data, isLoading } = useGetLoadsPublic()
	const { data: mine, isLoading: isLoadingMine } = useGetMyOffers()
	const { data: incoming, isLoading: isLoadingIncoming } = useGetIncomingOffers()
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')

	const navItems = [
		{ label: 'Доска заявок', href: DASHBOARD_URL.desk() },
		{ label: 'Мои предложения', href: DASHBOARD_URL.desk('my'), active: true },
	]

	// const fakeData = fakeCargoList

	console.log(data);


	return (
		<div className='flex h-full flex-col md:gap-4'>
			<NavInitializer items={navItems} />
			<div className='w-full bg-background md:rounded-4xl rounded-t-4xl px-4 py-8'>
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
						<Link href={DASHBOARD_URL.posting()}>
							<Button className='w-[260px] h-[54px] text-base'>Добавить</Button>
						</Link>
					</div>
				</div>
			) : data?.results ? (
				isDesktop ? (
					<Tabs defaultValue='desk'>
						<TabsList className='bg-transparent -mb-2'>
							<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='desk'>Я предложил</TabsTrigger>
							<TabsTrigger className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-brand rounded-none' value='drivers'>Предложили мне</TabsTrigger>
						</TabsList>
						<TabsContent value='desk'>
							<Activity>
								<DataTable
									columns={deskMyColumns}
									data={data.results}
								/>
							</Activity>
						</TabsContent>
						<TabsContent value='drivers'>
							<Activity>
								<DataTable
									columns={deskCarrierColumns}
									data={data.results}
								/>
							</Activity>
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
