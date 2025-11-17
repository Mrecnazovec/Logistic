'use client'

import { DASHBOARD_URL, IMG_URL } from "@/config/url.config";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

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

export function DocsPage() {
	const param = useParams<{ id: string }>()
	return <div className="h-full rounded-3xl bg-background p-8 space-y-4">
		{folderStructure.map((item, index) => (
			<Link className="flex gap-6 items-center not-last:pb-4 not-last:border-b-2" key={index} href={DASHBOARD_URL.order(`${param.id}/docs/${item.folder}`)}>
				<Image src={IMG_URL.svg('folder')} width={55} height={55} alt="" />
				{item.title}
			</Link>
		))}
	</div>
}
