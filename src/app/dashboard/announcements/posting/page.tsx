import { Metadata } from 'next'
import { Suspense } from 'react'
import { PostingPage } from './PostingPage'

export const metadata: Metadata = {
	title: 'Публикация заявки'
}

export default function page() {
	return (
		<Suspense fallback={null}>
			<PostingPage />
		</Suspense>
	)
}
