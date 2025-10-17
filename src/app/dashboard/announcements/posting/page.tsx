import { Metadata } from 'next'
import { PostingPage } from './PostingPage'

export const metadata: Metadata = {
	title: 'Публикация заявки'
}

export default function page() {
	return <PostingPage />
}
