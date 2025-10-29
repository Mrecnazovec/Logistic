'use client'

import { Button } from '@/components/ui/Button'
import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { DASHBOARD_URL } from '@/config/url.config'
import { Loader2, Search } from 'lucide-react'
import Link from 'next/link'
import { useSearchForm } from './Searching/useSearchForm'
// import { fakeCargoList } from '@/data/FakeData'
import { DataTable } from '@/components/ui/table/DataTable'
import { MobileDataTable } from '@/components/ui/table/MobileDataTable'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { deskColumns } from './table/DeskColumns'
import { useGetLoadsPublic } from '@/hooks/queries/loads/useGet/useGetLoadsPublic'

export function DeskPage() {
	const { data, isLoading } = useGetLoadsPublic()
	const { form, onSubmit } = useSearchForm()
	const isDesktop = useMediaQuery('(min-width: 768px)')

	// const fakeData = fakeCargoList

	console.log(data);


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
						<Link href={DASHBOARD_URL.posting()}>
							<Button className='w-[260px] h-[54px] text-base'>Добавить</Button>
						</Link>
					</div>
				</div>
			) : data?.results ? (
				isDesktop ? (
					<DataTable
						columns={deskColumns}
						data={data.results}
						isButton
					/>
				) : (
					<MobileDataTable data={data} />
				)
			) : null}
		</div>
	)
}
