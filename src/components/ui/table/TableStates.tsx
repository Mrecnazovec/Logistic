'use client'

import { useI18n } from '@/i18n/I18nProvider'
import { Loader2, Search } from 'lucide-react'

export function EmptyTableState() {
	const { t } = useI18n()

	return (
		<div className='h-full bg-background rounded-4xl bg-[url(/png/bg_announcements.png)] bg-no-repeat bg-center bg-contain flex items-center justify-center text-center p-4 min-h-[700px]'>
			<div className='flex items-center justify-center flex-col xs:gap-6 gap-3'>
				<div className='bg-background shadow-2xl p-4 rounded-full'>
					<Search className='size-5 text-brand' />
				</div>
				<h1 className='xs:text-5xl text-xl font-bold'>{t('components.table.empty.title')}</h1>
				<p className='xs:text-xl text-sm text-grayscale max-w-2xl text-center'>
					{t('components.table.empty.subtitle')}
				</p>
			</div>
		</div>
	)
}

export function LoaderTable() {
	return (
		<div className='bg-background rounded-4xl flex items-center justify-center h-full'>
			<Loader2 className='size-10 animate-spin' />
		</div>
	)
}
