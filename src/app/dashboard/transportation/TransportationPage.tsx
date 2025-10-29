'use client'

import { Form } from '@/components/ui/form-control/Form'
import { SearchFields } from '@/components/ui/search/SearchFields'
import { useGetLoadsPublic } from '@/hooks/queries/loads/useGet/useGetLoadsPublic'
import { Search } from 'lucide-react'
import { useSearchForm } from './Searching/useSearchForm'

export function TransportationPage() {
	const { data, isLoading } = useGetLoadsPublic()
	const { form, onSubmit } = useSearchForm()

	return (
		<div className='flex h-full flex-col gap-4'>
			<div className='w-full bg-background rounded-4xl px-4 py-8'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<SearchFields form={form} />
					</form>
				</Form>
			</div>
			<div className='flex-1 bg-background rounded-4xl bg-[url(/png/bg_announcements.png)] bg-no-repeat bg-center bg-contain flex items-center justify-center'>
				<div className='flex items-center justify-center flex-col gap-6'>
					<div className='bg-background shadow-2xl p-4 rounded-full'>
						<Search className='size-5 text-brand' />
					</div>
					<h1 className='text-5xl font-bold'>Пусто...</h1>
				</div>
			</div>
		</div>
	)
}
