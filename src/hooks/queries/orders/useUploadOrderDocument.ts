import type { OrderDocumentUploadDto } from '@/shared/types/Order.interface'
import { ordersService } from '@/services/orders.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useI18n } from '@/i18n/I18nProvider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'next/navigation'

export const useUploadOrderDocument = () => {
	const { t } = useI18n()
	const queryClient = useQueryClient()
	const params = useParams<{ id: string }>()

	const {
		mutate: uploadOrderDocument,
		mutateAsync: uploadOrderDocumentAsync,
		isPending: isLoadingUpload,
	} = useMutation({
		mutationKey: ['order', 'upload-document'],
		mutationFn: ({ id, data, category }: { id: string; data: OrderDocumentUploadDto; category: string }) =>
			ordersService.uploadOrderDocument(id, data, category),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get order', params.id] })
			queryClient.invalidateQueries({ queryKey: ['get order documents', params.id] })
			toast.success(t('hooks.orders.uploadDocument.success'))
		},
		onError(error) {
			const message = getErrorMessage(error) ?? t('hooks.orders.uploadDocument.error')
			toast.error(message)
		},
	})

	return useMemo(
		() => ({ uploadOrderDocument, uploadOrderDocumentAsync, isLoadingUpload }),
		[uploadOrderDocument, uploadOrderDocumentAsync, isLoadingUpload]
	)
}
