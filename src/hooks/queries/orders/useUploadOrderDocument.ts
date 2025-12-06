import { ordersService } from '@/services/orders.service'
import { OrderDocumentUploadDto } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const useUploadOrderDocument = () => {
	const queryClient = useQueryClient()

	const {
		mutate: uploadOrderDocument,
		mutateAsync: uploadOrderDocumentAsync,
		isPending: isLoadingUpload,
	} = useMutation({
		mutationKey: ['order', 'upload-document'],
		mutationFn: ({ id, data, category }: { id: string; data: OrderDocumentUploadDto; category: string }) =>
			ordersService.uploadOrderDocument(id, data, category),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['get order documents', variables.id] })
			toast.success('Документ загружен')
		},
		onError: (error) => {
			const message = getErrorMessage(error) ?? 'Не удалось загрузить документ'
			toast.error(message)
		},
	})

	return useMemo(
		() => ({ uploadOrderDocument, uploadOrderDocumentAsync, isLoadingUpload }),
		[uploadOrderDocument, uploadOrderDocumentAsync, isLoadingUpload]
	)
}
