'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NextTopLoader from 'nextjs-toploader'
import { PropsWithChildren, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import dynamic from 'next/dynamic'

const ReactQueryDevtools = dynamic(
	() => import('@tanstack/react-query-devtools').then((mod) => mod.ReactQueryDevtools),
	{ ssr: false },
)

export function Providers({ children }: PropsWithChildren) {
	const isDev = process.env.NODE_ENV === 'development'
	const [client] = useState(
		new QueryClient({
			defaultOptions: {
				queries: {
					refetchOnWindowFocus: false,
				},
			},
		})
	)

	return (
		<QueryClientProvider client={client}>
			{isDev ? <ReactQueryDevtools initialIsOpen={false} /> : null}
			<NextTopLoader showSpinner={false} />
			<Toaster toastOptions={{
				error: {
					style: {
						background: '#FCA5A5',
						color: '#991B1B',
					},
					iconTheme: {
						primary: '#dc3545',
						secondary: '#f8d7da',
					},
				},
				success: {
					style: {
						background: '#BBF7D0',
						color: '#166534',
					},
					iconTheme: {
						primary: '#198754',
						secondary: '#d1e7dd',
					},
				},
			}} />
			{children}
		</QueryClientProvider>
	)
}
