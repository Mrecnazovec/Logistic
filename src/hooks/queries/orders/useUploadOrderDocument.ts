import type { OrderDocumentUploadDto } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

type UploadPayload = {
	id: string
	data: OrderDocumentUploadDto
}

export const useUploadOrderDocument = () => {
	const queryClient = useQueryClient()

	const {
		mutate: uploadOrderDocument,
		mutateAsync: uploadOrderDocumentAsync,
		isPending: isLoadingUpload,
	} = useMutation({
		mutationKey: ['order', 'documents', 'upload'],
		mutationFn: async ({ id, data }: UploadPayload) => {
			console.log('[Mock upload payload]', {
				orderId: id,
				title: data.title,
				file: {
					name: data.file.name,
					size: data.file.size,
					type: data.file.type,
				},
			})

			await new Promise((resolve) => setTimeout(resolve, 1200))
		},
		onSuccess() {
			toast.success('Document prepared (mock)')
			queryClient.invalidateQueries({ queryKey: ['get order documents'] })
		},
		onError() {
			toast.error('Unable to mock upload document')
		},
	})

	return useMemo(
		() => ({ uploadOrderDocument, uploadOrderDocumentAsync, isLoadingUpload }),
		[uploadOrderDocument, uploadOrderDocumentAsync, isLoadingUpload]
	)
}
