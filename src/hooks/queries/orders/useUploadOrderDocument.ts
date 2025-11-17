import type { OrderDocumentUploadDto } from '@/shared/types/Order.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

import { ordersService } from '@/services/orders.service'
import { useParams } from 'next/navigation'
import { CategoryEnum } from '@/shared/enums/Category.enum'

type UploadPayload = {
	id: string
	data: OrderDocumentUploadDto
}

export const useUploadOrderDocument = () => {
	const queryClient = useQueryClient()
	const param = useParams<{ folder: CategoryEnum }>()


	const {
		mutate: uploadOrderDocument,
		mutateAsync: uploadOrderDocumentAsync,
		isPending: isLoadingUpload,
	} = useMutation({
		mutationKey: ['order', 'documents', 'upload'],
		mutationFn: async ({ id, data }: UploadPayload) => ordersService.uploadOrderDocument(id, data, param.folder),
		onSuccess(_, { id }) {
			toast.success('Документ успешно загружен')
			queryClient.invalidateQueries({ queryKey: ['get order documents', id] })
		},
		onError() {
			toast.error('Не удалось загрузить документ')
		},
	})

	return useMemo(
		() => ({ uploadOrderDocument, uploadOrderDocumentAsync, isLoadingUpload }),
		[uploadOrderDocument, uploadOrderDocumentAsync, isLoadingUpload]
	)
}
