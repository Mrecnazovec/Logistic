import { Metadata } from 'next'
import { Suspense } from 'react'
import { EditPage } from './EditPage'

export const metadata: Metadata = {
	title: 'Редактирование заявки'
}

export default function page() {
	return (
		<Suspense fallback={null}>
			<EditPage />
		</Suspense>
	)
}
