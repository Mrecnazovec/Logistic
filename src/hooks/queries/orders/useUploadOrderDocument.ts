import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

import { ordersService } from '@/services/orders.service'
import { CategoryEnum } from '@/shared/enums/Category.enum'
import type { OrderDocumentUploadDto } from '@/shared/types/Order.interface'

type UploadPayload = {
	id: string
	data: OrderDocumentUploadDto
}

export const useUploadOrderDocument = () => {
	const queryClient = useQueryClient()
	const param = useParams<{ folder?: string }>()
	const category = useMemo<CategoryEnum>(() => {
		const folder = (param.folder ?? '').toLowerCase()

		if (
			folder === CategoryEnum.CONTRACTS ||
			folder === CategoryEnum.LICENSES ||
			folder === CategoryEnum.LOADING ||
			folder === CategoryEnum.UNLOADING
		) {
			return folder
		}

		if (folder === CategoryEnum.OTHER || folder === 'others') {
			return CategoryEnum.OTHER
		}

		return CategoryEnum.OTHER
	}, [param.folder])

	const {
		mutate: uploadOrderDocument,
		mutateAsync: uploadOrderDocumentAsync,
		isPending: isLoadingUpload,
	} = useMutation({
		mutationKey: ['order', 'documents', 'upload', category],
		mutationFn: async ({ id, data }: UploadPayload) =>
			ordersService.uploadOrderDocument(id, data, category),
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
