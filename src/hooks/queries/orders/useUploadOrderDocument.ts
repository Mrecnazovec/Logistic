import { ordersService } from '@/services/orders.service'
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

	const { mutate: uploadOrderDocument, isPending: isLoadingUpload } = useMutation({
		mutationKey: ['order', 'documents', 'upload'],
		mutationFn: ({ id, data }: UploadPayload) => ordersService.uploadOrderDocument(id, data),
		onSuccess(_, { id }) {
			queryClient.invalidateQueries({ queryKey: ['get order documents', id] })
			queryClient.invalidateQueries({ queryKey: ['get order', id] })
			toast.success('Document uploaded')
		},
		onError() {
			toast.error('Unable to upload document')
		},
	})

	return useMemo(() => ({ uploadOrderDocument, isLoadingUpload }), [uploadOrderDocument, isLoadingUpload])
}
