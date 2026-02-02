'use client'

import { DASHBOARD_URL, IMG_URL } from '@/config/url.config'
import { useGetOrderDocuments } from '@/hooks/queries/orders/useGet/useGetOrderDocuments'
import { useI18n } from '@/i18n/I18nProvider'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export function DocsPage() {
	const { t, locale } = useI18n()
	const param = useParams<{ id: string }>()
	const { orderDocuments, isLoading } = useGetOrderDocuments()
	const documents = Array.isArray(orderDocuments) ? orderDocuments : orderDocuments?.documents ?? []

	const folderStructure = [
		{ title: t('order.docs.folder.licenses'), folder: 'licenses' },
		{ title: t('order.docs.folder.contracts'), folder: 'contracts' },
		{ title: t('order.docs.folder.loading'), folder: 'loading' },
		{ title: t('order.docs.folder.unloading'), folder: 'unloading' },
		{ title: t('order.docs.folder.other'), folder: 'others' },
	]

	const formatFileCount = (count: number) => {
		if (locale === 'ru') {
			const normalizedCount = Math.abs(count)
			const lastTwoDigits = normalizedCount % 100
			if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} ${t('order.docs.files.many')}`
			const lastDigit = normalizedCount % 10
			if (lastDigit === 1) return `${count} ${t('order.docs.files.one')}`
			if (lastDigit >= 2 && lastDigit <= 4) return `${count} ${t('order.docs.files.few')}`
			return `${count} ${t('order.docs.files.many')}`
		}
		return `${count} ${count === 1 ? t('order.docs.files.one') : t('order.docs.files.many')}`
	}

	const folderCounts = folderStructure.reduce<Record<string, number>>((acc, item) => {
		const normalizedFolder = item.folder.toLowerCase()
		const normalizedCategory = normalizedFolder === 'others' ? 'other' : normalizedFolder

		acc[item.folder] = documents.filter((document) => {
			const category = (document.category ?? '').toLowerCase()
			const title = (document.title ?? '').toLowerCase()
			return category === normalizedCategory || title === normalizedFolder
		}).length

		return acc
	}, {})

	return (
		<div className='h-full rounded-3xl bg-background p-8 space-y-4'>
			{folderStructure.map((item, index) => (
				<Link
					className='flex items-center justify-between gap-6 not-last:pb-4 not-last:border-b-2'
					key={index}
					href={DASHBOARD_URL.order(`${param.id}/docs/${item.folder}`)}
				>
					<div className='flex items-center gap-4'>
						<Image src={IMG_URL.svg('folder')} width={55} height={55} alt='' />
						<div className='flex flex-col'>
							<span>{item.title}</span>
							<span className='text-grayscale text-sm'>
								{isLoading ? t('order.docs.list.loading') : formatFileCount(folderCounts[item.folder] ?? 0)}
							</span>
						</div>
					</div>
				</Link>
			))}
		</div>
	)
}
