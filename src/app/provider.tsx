'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NextTopLoader from 'nextjs-toploader'
import { PropsWithChildren, useState } from 'react'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: PropsWithChildren) {
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
			<NextTopLoader showSpinner={false} />
			<Toaster />
			{children}
		</QueryClientProvider>
	)
}
