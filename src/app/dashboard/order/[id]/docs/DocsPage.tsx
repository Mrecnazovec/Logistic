'use client'

import { DASHBOARD_URL, IMG_URL } from "@/config/url.config";
import { useGetOrderDocuments } from "@/hooks/queries/orders/useGet/useGetOrderDocuments";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const folderStructure = [{
	title: 'Лицензии',
	folder: 'licenses'
}, {
	title: 'Договора',
	folder: 'contracts'
}, {
	title: 'Документы о погрузке',
	folder: 'loading'
}, {
	title: 'Документы о разгрузке',
	folder: 'unloading'
}, {
	title: 'Дополнительно',
	folder: 'others'
},]

const formatFileCount = (count: number) => {
	const normalizedCount = Math.abs(count)
	const lastTwoDigits = normalizedCount % 100

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} файлов`

	const lastDigit = normalizedCount % 10
	if (lastDigit === 1) return `${count} файл`
	if (lastDigit >= 2 && lastDigit <= 4) return `${count} файла`

	return `${count} файлов`
}

export function DocsPage() {
	const param = useParams<{ id: string }>()
	const { orderDocuments, isLoading } = useGetOrderDocuments()
	const documents = useMemo(
		() => (Array.isArray(orderDocuments) ? orderDocuments : orderDocuments?.documents ?? []),
		[orderDocuments]
	)

	const folderCounts = useMemo(
		() =>
			folderStructure.reduce<Record<string, number>>((acc, item) => {
				const normalizedFolder = item.folder.toLowerCase()
				const normalizedCategory = normalizedFolder === 'others' ? 'other' : normalizedFolder

				acc[item.folder] = documents.filter((document) => {
					const category = (document.category ?? '').toLowerCase()
					const title = (document.title ?? '').toLowerCase()
					return category === normalizedCategory || title === normalizedFolder
				}).length

				return acc
			}, {}),
		[documents]
	)

	return <div className="h-full rounded-3xl bg-background p-8 space-y-4">
		{folderStructure.map((item, index) => (
			<Link
				className="flex items-center justify-between gap-6 not-last:pb-4 not-last:border-b-2"
				key={index}
				href={DASHBOARD_URL.order(`${param.id}/docs/${item.folder}`)}
			>
				<div className="flex items-center gap-4">
					<Image src={IMG_URL.svg('folder')} width={55} height={55} alt="" />
					<div className="flex flex-col">
						<span>{item.title}</span>
						<span className="text-grayscale text-sm">
							{isLoading ? '...' : formatFileCount(folderCounts[item.folder] ?? 0)}
						</span>
					</div>
				</div>

			</Link>
		))}
	</div>
}
