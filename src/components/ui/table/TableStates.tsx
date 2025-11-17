import { Loader2, Search } from "lucide-react";

export function EmptyTableState() {
	return <div className='h-full bg-background rounded-4xl bg-[url(/png/bg_announcements.png)] bg-no-repeat bg-center bg-contain flex items-center justify-center'>

		<div className='flex items-center justify-center flex-col gap-6'>
			<div className='bg-background shadow-2xl p-4 rounded-full'>
				<Search className='size-5 text-brand' />
			</div>
			<h1 className='text-5xl font-bold'>Ничего не найдено</h1>
			<p className='text-xl text-grayscale max-w-2xl text-center'>
				Мы не нашли подходящих результатов, попробуйте изменить фильтры
			</p>
		</div>
	</div>
}

export function LoaderTable() {
	return <div className='bg-background rounded-4xl flex items-center justify-center h-full'>
		<Loader2 className='size-10 animate-spin' />
	</div>
}